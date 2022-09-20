import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { tryToGetPersonInfo } from "../../store/types/PersonInfo";
import axiosClient, { baseURL } from "../../axiosClient";
import { alignItemsList, IGoalData, IStatData } from "../../types";
import "./styles.sass";

const DonatStatContainer = () => {
  const dispatch = useDispatch();
  const { id, name } = useParams();
  // const notifications = useSelector((state: any) => state.notifications);

  // const [lastNotif, setLastNotif] = useState<any>({
  //   wallet_type: "tron",
  //   sum_donation: 50,
  //   username: "tester",
  //   donation_message:
  //     "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Architecto, optio deleniti. Placeat facilis cupiditate dolorem aspernatur quaerat magnam soluta, ratione ullam commodi provident officiis nobis quasi corporis atque? Numquam, necessitatibus!",
  // });

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

  // useEffect(() => {
  //   notifications.length && setLastNotif(notifications[0].donation);
  // }, [notifications]);

  useEffect(() => {
    const getStatData = async () => {
      const response = await axiosClient.get(
        baseURL + "/api/user/stats-widget/" + id
      );
      response.status === 200 && setStatData(response.data);
    };
    getStatData();
  }, []);

  const {
    title,
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
      <div
        className="donat-stat_container"
        style={{
          alignItems: alignItemsList[aligment],
        }}
      >
        <div
          className="donat-stat_title"
          style={{
            background: bar_color,
          }}
        >
          <span
            style={{
              color: title_color,
            }}
          >
            {data_type} {time_period.toLowerCase()}
          </span>
        </div>
        <div className="donat-stat_list">
          <p
            className="donat-stat_list-item"
            style={{
              color: content_color,
            }}
          >
            Jordan - 30 USD
          </p>
        </div>
      </div>
    </div>
  );
};

export default DonatStatContainer;
