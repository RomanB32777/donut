import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import axiosClient, { baseURL } from "../../axiosClient";
import {
  alignFlextItemsList,
  alignItemsList,
  IGoalData,
  IStatData,
} from "../../types";
import { getCurrentTimePeriodQuery, getStstsDataTypeQuery } from "../../consts";
import "./styles.sass";
import { tryToGetPersonInfo } from "../../store/types/PersonInfo";

const LIMIT = 3;

const DonatStatContainer = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const { id, name } = useParams();
  const notifications = useSelector((state: any) => state.notifications);

  const [lastNotif, setLastNotif] = useState<any>({});

  const [renderList, setRenderList] = useState<any[]>([]);

  const [statData, setStatData] = useState<IStatData>({
    id: 0,
    title: "",
    stat_description: "",
    title_color: "#ffffff",
    bar_color: "#1D14FF",
    content_color: "#212127",
    aligment: "Center",
    data_type: "latest-donations",
    time_period: "today",
    template: [],
  });

  const getDonations = async () => {
    try {
      const { time_period, data_type } = statData;
      const timePeriod = getCurrentTimePeriodQuery(time_period);
      const typeStatData = getStstsDataTypeQuery(data_type);

      if (timePeriod && typeStatData) {
        const { data } = await axiosClient.get(
          `/api/donation/widgets/${typeStatData}/${user.id}?limit=${LIMIT}&timePeriod=${timePeriod}&isStatPage=true`
        );
        data && data.length && setRenderList(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getStatData = async () => {
    const response = await axiosClient.get(
      baseURL + "/api/user/stats-widget/" + id
    );
    if (response.status === 200) {
      setStatData(response.data);
      await getDonations();
    }
  };

  const renderItem = (objToRender: any) => {
    const { template } = statData;
    var reUsername = /{username}/gi;
    var reSum = /{sum}/gi;
    var reMessage = /{message}/gi;
    const str = Array.isArray(template) ? template.join(" ") : template;
    let newStr = str.replace(reUsername, objToRender.username);
    newStr = newStr.replace(reSum, objToRender.sum_donation || objToRender.sum);
    newStr = newStr.replace(reMessage, objToRender.donation_message || "");
    return newStr;
  };

  useEffect(() => {
    dispatch(
      tryToGetPersonInfo({
        username: name,
      })
    );
  }, []);

  useEffect(() => {
    lastNotif && user.id && getStatData();
  }, [user, lastNotif]);

  useEffect(() => {
    notifications.length && setLastNotif(notifications[0].donation);
  }, [notifications]);

  const {
    title_color,
    template,
    data_type,
    time_period,
    bar_color,
    content_color,
    aligment,
  } = statData;

  return (
    <div className="donat-stat">
      <div className="donat-stat_container">
        <div>
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
                  const renderStr = renderItem(item);
                  return (
                    <p
                      key={renderStr}
                      className="donat-stat_list-item"
                      style={{
                        color: content_color,
                        textAlign:
                          (aligment === "Left" && "left") ||
                          (aligment === "Right" && "right") ||
                          "center",
                        // aligment.toLowerCase()
                        // textAlign: alignItemsList[aligment] || "center",
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
    </div>
  );
};

export default DonatStatContainer;
