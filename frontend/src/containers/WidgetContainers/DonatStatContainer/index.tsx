import { useEffect, useMemo, useState } from "react";

import { useDispatch } from "react-redux";
import { useParams } from "react-router";

import { useAppSelector } from "hooks/reduxHooks";
import axiosClient from "modules/axiosClient";
import {
  getCurrentTimePeriodQuery,
  getFontColorStyles,
  getFontsList,
  getStatsDataTypeQuery,
  loadFonts,
  renderStatItem,
} from "utils";
import { tryToGetPersonInfo } from "store/types/PersonInfo";
import { alignFlextItemsList, alignItemsList, widgetApiUrl } from "consts";
import { AlignText, IWidgetStatData } from "appTypes";
import "./styles.sass";

const LIMIT = 3;

const DonatStatContainer = () => {
  const dispatch = useDispatch();
  const { id, name } = useParams();
  const { personInfo, notifications } = useAppSelector((state) => state);
  const { list } = notifications;

  const [lastNotif, setLastNotif] = useState<any>({});
  const [renderList, setRenderList] = useState<any[]>([]);
  const [statData, setStatData] = useState<IWidgetStatData | null>(null);

  const getDonations = async () => {
    if (statData) {
      try {
        const { time_period, data_type } = statData;
        const customPeriod = time_period.split("-");

        const { data } = await axiosClient.get(
          `${widgetApiUrl}/${data_type}/${personInfo.id}?limit=${LIMIT}&${
            Boolean(customPeriod.length > 1)
              ? `timePeriod=custom&startDate=${customPeriod[0]}&endDate=${customPeriod[1]}`
              : `timePeriod=${time_period}&spam_filter=${personInfo.spam_filter}`
          }&isStatPage=true`
        );
        data && data.length && setRenderList(data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getStatData = async (id: string) => {
    const { data, status } = await axiosClient.get(
      `/api/widget/stats-widget/${id}`
    );

    if (status === 200) {
      const fonts = await getFontsList();

      const { title_font, content_font } = data;

      const loadedFonts = await loadFonts({
        fonts,
        fields: { title_font, content_font },
      });

      const widgetData: IWidgetStatData = {
        ...data,
        ...loadedFonts,
      };

      setStatData(widgetData);
    }
  };

  useEffect(() => {
    name && dispatch(tryToGetPersonInfo(name));
  }, [name]);

  useEffect(() => {
    statData && personInfo.id && getDonations();
  }, [personInfo, statData, lastNotif]);

  useEffect(() => {
    id && getStatData(id);
  }, [id]);

  useEffect(() => {
    list.length && setLastNotif(list[0].donation);
  }, [list]);

  const timePeriodName = useMemo(
    () =>
      statData &&
      statData.time_period &&
      getCurrentTimePeriodQuery(statData.time_period),
    [statData]
  );

  const typeStatData = useMemo(
    () =>
      statData &&
      statData.data_type &&
      getStatsDataTypeQuery(statData.data_type),
    [statData]
  );

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
        <div className="donat-stat_container">
          <span
            className="donat-stat_title"
            style={{
              background: bar_color,
              ...getFontColorStyles(title_color, title_font),
            }}
          >
            {typeStatData} {timePeriodName && timePeriodName.toLowerCase()}
          </span>
          <div
            className="donat-stat_list__wrapper"
            style={{
              justifyContent: alignFlextItemsList[aligment],
            }}
          >
            <div className="donat-stat_list">
              {Boolean(renderList) &&
                renderList.map((item) => {
                  const renderStr = renderStatItem(template, item);
                  return (
                    <p
                      key={renderStr}
                      className="donat-stat_list-item"
                      style={{
                        ...getFontColorStyles(content_color, content_font),
                        textAlign:
                          (alignItemsList[aligment] as AlignText) || "center",
                        // aligment.toLowerCase()
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

  return <></>;
};

export default DonatStatContainer;
