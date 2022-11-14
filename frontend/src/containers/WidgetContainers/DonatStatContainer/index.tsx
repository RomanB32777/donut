import { useEffect, useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import axiosClient, { baseURL } from "../../../axiosClient";
import {
  alignFlextItemsList,
  alignItemsList,
  AlignText,
  IStatData,
} from "../../../types";
import {
  currBlockchain,
  getCurrentTimePeriodQuery,
  getStatsDataTypeQuery,
  getUsdKoef,
  renderStatItem,
} from "../../../utils";
import { tryToGetPersonInfo } from "../../../store/types/PersonInfo";
import { widgetApiUrl } from "../../../consts";
import "./styles.sass";

const LIMIT = 3;

const DonatStatContainer = () => {
  const dispatch = useDispatch();
  const { id, name } = useParams();
  const user = useSelector((state: any) => state.personInfo).main_info;
  const notifications = useSelector((state: any) => state.notifications);

  const [lastNotif, setLastNotif] = useState<any>({});
  const [renderList, setRenderList] = useState<any[]>([]);
  const [statData, setStatData] = useState<IStatData | null>(null);
  const [usdtKoef, setUsdtKoef] = useState<number>(0);

  const getDonations = async () => {
    if (statData) {
      try {
        const { time_period, data_type } = statData;
        const customPeriod = time_period.split("-");

        const { data } = await axiosClient.get(
          `${widgetApiUrl}/${data_type}/${user.user_id}?limit=${LIMIT}&${
            Boolean(customPeriod.length > 1)
              ? `timePeriod=custom&startDate=${customPeriod[0]}&endDate=${customPeriod[1]}`
              : `timePeriod=${time_period}`
          }&isStatPage=true&blockchain=${currBlockchain?.nativeCurrency.symbol}`
        );
        data && data.length && setRenderList(data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getStatData = async (id: string) => {
    const response = await axiosClient.get(
      `${baseURL}/api/widget/stats-widget/${id}`
    );
    if (response.status === 200) {
      setStatData(response.data);
    }
  };

  useEffect(() => {
    dispatch(
      tryToGetPersonInfo({
        username: name,
      })
    );
    getUsdKoef(process.env.REACT_APP_BLOCKCHAIN || "evmos", setUsdtKoef);
  }, []);

  useEffect(() => {
    statData && user.user_id && getDonations();
  }, [user, statData, lastNotif]);

  useEffect(() => {
    id && getStatData(id);
  }, [id]);

  useEffect(() => {
    notifications.length && setLastNotif(notifications[0].donation);
  }, [notifications]);

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
    const { title_color, bar_color, content_color, aligment, template } =
      statData;

    return (
      <div className="donat-stat">
        <div className="donat-stat_container">
          <span
            className="donat-stat_title"
            style={{
              background: bar_color,
              color: title_color,
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
                  const renderStr = renderStatItem(template, item, usdtKoef);
                  return (
                    <p
                      key={renderStr}
                      className="donat-stat_list-item"
                      style={{
                        color: content_color,
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

  return null;
};

export default DonatStatContainer;
