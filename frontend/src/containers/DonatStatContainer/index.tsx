import { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { useParams } from "react-router";
import axiosClient, { baseURL } from "../../axiosClient";
import { alignItemsList, IGoalData, IStatData } from "../../types";
import { filterCurrentPeriodItems } from "../../consts";
import "./styles.sass";

const DonatStatContainer = () => {
  const { id, name } = useParams();
  const notifications = useSelector((state: any) => state.notifications);

  const [lastNotif, setLastNotif] = useState<any>({});
  const [statData, setStatData] = useState<IStatData>({
    id: 0,
    title: "",
    stat_description: "",
    title_color: "#ffffff",
    bar_color: "#1D14FF",
    content_color: "#212127",
    aligment: "Center",
    data_type: "string",
    time_period: "string",
    template: [],
  });

  const getStatData = async () => {
    const response = await axiosClient.get(
      baseURL + "/api/user/stats-widget/" + id
    );
    response.status === 200 && setStatData(response.data);
  };

  useEffect(() => {
    notifications.length && setLastNotif(notifications[0].donation);
  }, [notifications]);

  // useEffect(() => {
  //   if (lastNotif.goal_id && lastNotif.goal_id === id) {
  //     getStatData();
  //   }
  // }, [lastNotif]);

  useEffect(() => {
    getStatData();
  }, []);

  const {
    title_color,
    template,
    data_type,
    time_period,
    bar_color,
    content_color,
    aligment,
  } = statData;

  const timeCurrentPeriod = Object.keys(filterCurrentPeriodItems).find(
    (key: string) => filterCurrentPeriodItems[key] === time_period
  );

  // console.log(timeCurrentPeriod);

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
              justifyContent: alignItemsList[aligment],
            }}
          >
            <div className="donat-stat_list">
              <p
                className="donat-stat_list-item"
                style={{
                  color: content_color,
                }}
              >
                {template}
                {/* Jordan - 30 USD */}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonatStatContainer;
