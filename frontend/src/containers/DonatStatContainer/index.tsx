import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { MaticIcon, TronIcon } from "../../icons/icons";
import { tryToGetPersonInfo } from "../../store/types/PersonInfo";

import bigImg from "../../assets/big_don.png";
import "./styles.sass";
import { Progress } from "antd";
import axiosClient, { baseURL } from "../../axiosClient";
import { IGoalData } from "../../types";

const DonatStatContainer = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  // const notifications = useSelector((state: any) => state.notifications);

  // const [lastNotif, setLastNotif] = useState<any>({
  //   wallet_type: "tron",
  //   sum_donation: 50,
  //   username: "tester",
  //   donation_message:
  //     "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Architecto, optio deleniti. Placeat facilis cupiditate dolorem aspernatur quaerat magnam soluta, ratione ullam commodi provident officiis nobis quasi corporis atque? Numquam, necessitatibus!",
  // });

  const [goalData, setGoalData] = useState<IGoalData>({
    id: 0,
    title: "",
    amount_goal: 0,
    amount_raised: 0,
    isArchive: false,
    title_color: "#ffffff",
    progress_color: "#1D14FF",
    background_color: "#212127",
    creator_id: "0",
  });

  // useEffect(() => {
  //   notifications.length && setLastNotif(notifications[0].donation);
  // }, [notifications]);

  useEffect(() => {
    const getGoalData = async () => {
      const response = await axiosClient.get(
        baseURL + "/api/user/goals-widget/" + id
      );
      response.status === 200 && setGoalData(response.data);
    };
    getGoalData();
  }, []);

  const {
    title,
    title_color,
    progress_color,
    background_color,
    amount_goal,
    amount_raised,
  } = goalData;

  return (
    <div className="donat-stat">
      <div className="donat-stat_container">
        <div className="donat-stat_title">
          <p>
            <span
              style={{
                color: title_color,
              }}
            >
              {/* {title} */}
              develop
            </span>
          </p>
        </div>
        {/* <div
          className="donat-stat_progress"
          style={{
            background: background_color,
          }}
        >
          <Progress
            type="circle"
            percent={Math.round((amount_raised / amount_goal) * 100)}
            width={150}
            strokeColor={progress_color}
          />
          <p>
            {amount_raised} / {amount_goal} USD
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default DonatStatContainer;
