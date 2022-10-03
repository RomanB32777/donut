import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import axiosClient, { baseURL } from "../../../axiosClient";
import {
  alignFlextItemsList,
  alignItemsList,
  AlignText,
  IStatData,
} from "../../../types";
import { getCurrentTimePeriodQuery, getStatsDataTypeQuery } from "../../../consts";
import { tryToGetPersonInfo } from "../../../store/types/PersonInfo";
import "./styles.sass";
import { getUsdKoef, renderStatItem, renderStrWithTokens } from "../../../utils";

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
        const timePeriod = getCurrentTimePeriodQuery(time_period);
        const typeStatData = getStatsDataTypeQuery(data_type);
        const customPeriod = time_period.split("-");

        if (timePeriod && typeStatData) {
          const { data } = await axiosClient.get(
            `/api/donation/widgets/${typeStatData}/${user.user_id}?limit=${LIMIT}&${
              Boolean(customPeriod.length > 1)
                ? `timePeriod=${timePeriod}&startDate=${customPeriod[0]}&endDate=${customPeriod[1]}`
                : `timePeriod=${timePeriod}`
            }&isStatPage=true`
          );
          data && data.length && setRenderList(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getStatData = async () => {
    const response = await axiosClient.get(
      baseURL + "/api/widget/stats-widget/" + id
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
    getUsdKoef("evmos", setUsdtKoef);
  }, []);

  useEffect(() => {
    statData && user.user_id && getDonations();
  }, [user, statData, lastNotif]);

  useEffect(() => {
    getStatData();
  }, [user]);

  useEffect(() => {
    notifications.length && setLastNotif(notifications[0].donation);
  }, [notifications]);

  if (statData) {
    const {
      title_color,
      data_type,
      time_period,
      bar_color,
      content_color,
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
              color: title_color,
            }}
          >
            {data_type} {time_period.toLowerCase()}
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
