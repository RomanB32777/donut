import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import axiosClient, { baseURL } from "../../axiosClient";
import {
  alignFlextItemsList,
  alignItemsList,
  AlignText,
  IStatData,
} from "../../types";
import { getCurrentTimePeriodQuery, getStstsDataTypeQuery } from "../../consts";
import { tryToGetPersonInfo } from "../../store/types/PersonInfo";
import "./styles.sass";
import { renderStrWithTokens } from "../../utils";

const LIMIT = 3;

// const initStatData: IStatData = {
//   id: 0,
//   title: "",
//   stat_description: "",
//   title_color: "#ffffff",
//   bar_color: "#1D14FF",
//   content_color: "#212127",
//   aligment: "Center",
//   data_type: "latest-donations",
//   time_period: "today",
//   template: [],
// };

const DonatStatContainer = () => {
  const dispatch = useDispatch();
  const { id, name } = useParams();
  const user = useSelector((state: any) => state.user);
  const notifications = useSelector((state: any) => state.notifications);

  const [lastNotif, setLastNotif] = useState<any>({});
  const [renderList, setRenderList] = useState<any[]>([]);
  const [statData, setStatData] = useState<IStatData | null>(null);

  const getDonations = async () => {
    if (statData) {
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
    if (statData) {
      const { template } = statData;
      return renderStrWithTokens(template, [
        {
          re: /{username}/gi,
          to: objToRender.username,
        },
        {
          re: /{sum}/gi,
          to: objToRender.sum_donation || objToRender.sum,
        },
        {
          re: /{message}/gi,
          to: objToRender.donation_message || "",
        },
      ]);
      // return renderStrWithTokens(template, objToRender, ["username", "sum", "message"]);
    }
    return "";
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

  if (statData) {
    const {
      title_color,
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
      </div>
    );
  }

  return null;
};

export default DonatStatContainer;
