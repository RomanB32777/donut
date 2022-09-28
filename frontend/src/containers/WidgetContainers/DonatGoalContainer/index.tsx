import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import { Progress } from "antd";
import axiosClient, { baseURL } from "../../../axiosClient";
import { IGoalData } from "../../../types";
import "./styles.sass";

const DonatGoalContainer = () => {
  const { id, name } = useParams();
  const notifications = useSelector((state: any) => state.notifications);

  const [lastNotif, setLastNotif] = useState<any>({});

  const [goalData, setGoalData] = useState<IGoalData>({
    id: 0,
    title: "",
    amount_goal: 0,
    amount_raised: 0,
    isarchive: false,
    title_color: "#ffffff",
    progress_color: "#1D14FF",
    background_color: "#212127",
    creator_id: "0",
  });

  const getGoalData = async () => {
    const response = await axiosClient.get(
      `${baseURL}/api/user/goals-widget/${name}/${id}`
    );
    response.status === 200 && setGoalData(response.data);
  };

  useEffect(() => {
    notifications.length && setLastNotif(notifications[0].donation);
  }, [notifications]);

  useEffect(() => {
    if (lastNotif.goal_id && lastNotif.goal_id === id) {
      getGoalData();
    }
  }, [lastNotif]);

  useEffect(() => {
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
    <div className="donat-goal">
      <div className="donat-goal_container">
        <div className="donat-goal_title">
          <p>
            <span
              style={{
                color: title_color,
              }}
            >
              {title}
            </span>
          </p>
        </div>
        <div
          className="donat-goal_progress"
          style={{
            background: background_color,
          }}
        >
          <Progress
            type="circle"
            percent={Math.round((amount_raised / amount_goal) * 100)}
            width={150}
            strokeColor={progress_color}
            format={(percent) => (
              <span
                style={{
                  color: "#fff",
                }}
              >
                {percent}%
              </span>
            )}
          />
          <p>
            {amount_raised} / {amount_goal} USD
          </p>
        </div>
      </div>
    </div>
  );
};

export default DonatGoalContainer;
