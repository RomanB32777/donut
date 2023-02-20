import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { IStatData, statsDataKeys } from "types";

import { useAppSelector } from "hooks/reduxHooks";
import { useGetCreatorInfoQuery } from "store/services/UserService";
import { useGetStatsWidgetDataQuery } from "store/services/StatsService";
import { useLazyGetWidgetDonationsQuery } from "store/services/DonationsService";

import {
  addNotFoundUserNotification,
  getCurrentTimePeriodQuery,
  getFontColorStyles,
  getFontsList,
  getStatsDataTypeQuery,
  loadFonts,
  renderStatItem,
} from "utils";
import {
  alignFlextItemsList,
  alignItemsList,
  initWidgetStatData,
} from "consts";
import { ISelectItem } from "components/SelectInput";
import { AlignText, IFont, IWidgetStatData } from "appTypes";
import "./styles.sass";

const LIMIT = 3;
const fontsFields: statsDataKeys[] = ["title_font", "content_font"];

const DonatStatContainer = () => {
  const { id, name } = useParams();
  const { list } = useAppSelector(({ notifications }) => notifications);

  const { data: personInfo, isError } = useGetCreatorInfoQuery(name as string, {
    skip: !name,
  });

  const { data: widgetData } = useGetStatsWidgetDataQuery(
    {
      username: name as string,
      id: id as string,
    },
    { skip: !name || !id }
  );

  const [getWidgetDonations] = useLazyGetWidgetDonationsQuery();

  const [fonts, setFonts] = useState<ISelectItem[]>([]);
  const [renderList, setRenderList] = useState<any[]>([]);
  const [statData, setStatData] = useState<IWidgetStatData | null>(null);

  const getWidgetStatData = (
    widgetData: IStatData,
    fontObj?: Record<string, IFont>
  ) =>
    // convert IStatData -> IWidgetStatData
    Object.keys(widgetData).reduce((values, key) => {
      const keyField = key as statsDataKeys;
      if (fontsFields.includes(keyField))
        return {
          ...values,
          [keyField]: {
            name: fontObj ? fontObj[keyField] : widgetData[keyField],
          },
        };
      return {
        ...values,
        [keyField]: widgetData[keyField],
      };
    }, initWidgetStatData);

  useEffect(() => {
    const getStatWidgetData = async () => {
      if (widgetData) {
        let widgetDataInfo = getWidgetStatData(widgetData);

        if (!fonts.length) {
          const fontsInfo = await getFontsList();

          const { title_font, content_font } = widgetData;

          const loadedFonts = await loadFonts({
            fonts: fontsInfo,
            fields: { title_font, content_font },
          });

          setFonts(fontsInfo);
          widgetDataInfo = getWidgetStatData(widgetData, loadedFonts);
        }

        setStatData(widgetDataInfo);
      }
    };

    getStatWidgetData();
  }, [widgetData, fonts]);

  useEffect(() => {
    const getDonations = async () => {
      if (statData && personInfo) {
        try {
          const { time_period, data_type } = statData;
          const customPeriod = time_period.split("-");

          const query = {
            limit: LIMIT,
            timePeriod: time_period,
            spam_filter: personInfo.spam_filter,
          };

          const { data } = await getWidgetDonations({
            userID: personInfo.id,
            data_type,
            query:
              customPeriod.length > 1
                ? Object.assign(query, {
                    timePeriod: "custom",
                    startDate: customPeriod[0],
                    endDate: customPeriod[1],
                  })
                : query,
          });
          data && setRenderList(data);
        } catch (error) {
          console.log(error);
        }
      }
    };

    getDonations();
  }, [list, statData, personInfo]);

  const timePeriodName = useMemo(
    () => statData && getCurrentTimePeriodQuery(statData.time_period),
    [statData]
  );

  const typeStatData = useMemo(
    () => statData && getStatsDataTypeQuery(statData.data_type),
    [statData]
  );

  if (!personInfo) {
    isError && addNotFoundUserNotification();
    return null;
  }

  if (statData) {
    const {
      title_color,
      title_font,
      bar_color,
      content_color,
      content_font,
      aligment,
      template,
    } = statData;

    return (
      <div className="donat-stat">
        <div className="widget-container">
          <span
            className="title"
            style={{
              background: bar_color,
              ...getFontColorStyles(title_color, title_font),
            }}
          >
            {typeStatData} {timePeriodName && timePeriodName.toLowerCase()}
          </span>
          <div
            className="list__wrapper"
            style={{
              justifyContent: alignFlextItemsList[aligment],
            }}
          >
            <div className="list">
              {Boolean(renderList.length) &&
                renderList.map((item) => {
                  const renderStr = renderStatItem(template, item);
                  return (
                    <p
                      key={renderStr}
                      className="item"
                      style={{
                        ...getFontColorStyles(content_color, content_font),
                        textAlign:
                          (alignItemsList[aligment] as AlignText) || "center",
                      }}
                    >
                      {renderStr}
                    </p>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default DonatStatContainer;
