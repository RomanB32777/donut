import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { useIntl } from "react-intl";
import { donationsQueryData, IStatData, statsDataKeys } from "types";

import { useAppSelector } from "hooks/reduxHooks";
import { useGetCreatorInfoQuery } from "store/services/UserService";
import { useGetStatsWidgetDataQuery } from "store/services/StatsService";
import { useLazyGetWidgetDonationsQuery } from "store/services/DonationsService";

import {
  addNotFoundUserNotification,
  getCurrentTimePeriodQuery,
  getFontColorStyles,
  getFontsList,
  getRandomStr,
  getStatsDataTypeQuery,
  loadFonts,
  renderStatItem,
} from "utils";
import { alignFlexItemsList, alignItemsList, initWidgetStatData } from "consts";
import { ISelectItem } from "components/SelectInput";
import { AlignText, IFont, IWidgetStatData } from "appTypes";
import "./styles.sass";

const LIMIT = 3;
const fontsFields: statsDataKeys[] = ["titleFont", "contentFont"];

const DonatStatContainer = () => {
  const intl = useIntl();
  const { id, name } = useParams();
  const { list } = useAppSelector(({ notifications }) => notifications);

  const { data: personInfo, isError } = useGetCreatorInfoQuery(name as string, {
    skip: !name,
  });

  const { data: widgetData } = useGetStatsWidgetDataQuery(id ?? skipToken);
  const [getWidgetDonations] = useLazyGetWidgetDonationsQuery();

  const [fonts, setFonts] = useState<ISelectItem[]>([]);
  const [renderList, setRenderList] = useState<any[]>([]); // TODO - remove any
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

          const { titleFont, contentFont } = widgetData;

          const loadedFonts = await loadFonts({
            fonts: fontsInfo,
            fields: { titleFont, contentFont },
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
          const { id: userId, creator } = personInfo;
          const { timePeriod, dataType, customTimePeriod } = statData;

          const query: donationsQueryData = {
            limit: LIMIT,
            timePeriod: timePeriod,
            spamFilter: creator?.spamFilter,
          };

          const [params]: Parameters<typeof getWidgetDonations> = [
            {
              userId,
              dataType,
              query,
            },
          ];

          if (customTimePeriod && params.query) {
            const customPeriod = customTimePeriod.split("-");
            params.query = {
              ...params.query,
              startDate: customPeriod[0],
              endDate: customPeriod[1],
            };
          }
          const { data } = await getWidgetDonations(params);
          data && setRenderList(data);
        } catch (error) {
          console.log(error);
        }
      }
    };

    getDonations();
  }, [list, statData, personInfo]);

  const timePeriodName = useMemo(() => {
    if (statData) {
      const { timePeriod, customTimePeriod } = statData;

      if (customTimePeriod) return customTimePeriod;
      return intl.formatMessage({
        id: getCurrentTimePeriodQuery(timePeriod),
      });
    }
  }, [statData]);

  const typeStatData = useMemo(
    () =>
      statData &&
      intl.formatMessage({
        id: getStatsDataTypeQuery(statData.dataType),
      }),
    [statData]
  );

  if (!personInfo) {
    isError && addNotFoundUserNotification();
    return null;
  }

  if (statData) {
    const {
      titleColor,
      titleFont,
      barColor,
      contentColor,
      contentFont,
      textAlignment,
      template,
    } = statData;

    return (
      <div className="donat-stat">
        <div className="widget-container">
          <span
            className="title"
            style={{
              background: barColor,
              ...getFontColorStyles(titleColor, titleFont),
            }}
          >
            {typeStatData} {timePeriodName && timePeriodName.toLowerCase()}
          </span>
          <div
            className="list__wrapper"
            style={{
              justifyContent: alignFlexItemsList[textAlignment],
            }}
          >
            <div className="list">
              {Boolean(renderList.length) &&
                renderList.map((item) => {
                  const renderStr = renderStatItem(template, item);
                  return (
                    <p
                      key={getRandomStr(5)}
                      className="item"
                      style={{
                        ...getFontColorStyles(contentColor, contentFont),
                        textAlign:
                          (alignItemsList[textAlignment] as AlignText) ||
                          "center",
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
