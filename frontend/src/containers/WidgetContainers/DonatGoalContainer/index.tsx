import { useEffect, useState } from "react";
import { Progress } from "antd";
import { goalDataKeys } from "types";

import { useParams } from "react-router";

import axiosClient from "modules/axiosClient";
import { useAppSelector } from "hooks/reduxHooks";
import { getFontColorStyles, getFontsList, loadFonts } from "utils";
import { initWidgetGoalData } from "consts";
import { IWidgetGoalData } from "appTypes";
import "./styles.sass";

const fontsFields: goalDataKeys[] = ["title_font", "progress_font"];

const DonatGoalContainer = () => {
  const { id, name } = useParams();
  const { list } = useAppSelector(({ notifications }) => notifications);

  const [goalData, setGoalData] = useState<IWidgetGoalData | null>(null);

  const getGoalData = async (cb: (data: IWidgetGoalData) => any) => {
    const { data, status } = await axiosClient.get(
      `/api/widget/goals-widget/${name}/${id}`
    );
    if (status === 200) {
      // convert IGoalData -> IWidgetGoalData
      const widgetData = Object.keys(data).reduce((values, key) => {
        const keyField = key as goalDataKeys;
        if (fontsFields.includes(keyField))
          return {
            ...values,
            [keyField]: {
              name: data[keyField],
            },
          };
        return {
          ...values,
          [keyField]: data[keyField],
        };
      }, initWidgetGoalData);
      cb(widgetData);
    }
  };

  const getGoalWidgetData = async (widgetData: IWidgetGoalData) => {
    console.log("init");

    const fonts = await getFontsList();

    const { title_font, progress_font } = widgetData;

    const loadedFonts = await loadFonts({
      fonts,
      fields: {
        title_font: title_font.name,
        progress_font: progress_font.name,
      },
    });

    setGoalData({ ...widgetData, ...loadedFonts });
  };

  useEffect(() => {
    if (list.length && id) {
      const { donation } = list[0];

      if (donation && donation.goal_id === id)
        getGoalData((data) => setGoalData((prev) => ({ ...prev, ...data })));
    }
  }, [list, id]);

  useEffect(() => {
    id && name && getGoalData(getGoalWidgetData);
  }, [id, name]);

  if (goalData) {
    const {
      title,
      title_color,
      title_font,
      progress_color,
      progress_font,
      background_color,
      amount_goal,
      amount_raised,
    } = goalData;

    return (
      <div className="donat-goal">
        <div className="donat-goal_container">
          <div className="donat-goal_title">
            <p>
              <span style={getFontColorStyles(title_color, title_font)}>
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
            <p style={getFontColorStyles("#fff", progress_font)}>
              {amount_raised} / {amount_goal} USD
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <></>;
};

export default DonatGoalContainer;
