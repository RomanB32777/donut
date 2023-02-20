import { useEffect, useState } from "react";
import { Progress } from "antd";
import { goalDataKeys, IGoalData } from "types";

import { useParams } from "react-router";

import { useAppSelector } from "hooks/reduxHooks";
import { useGetGoalsWidgetDataQuery } from "store/services/GoalsService";
import { getFontColorStyles, getFontsList, loadFonts } from "utils";
import { initWidgetGoalData } from "consts";
import { ISelectItem } from "components/SelectInput";
import { IFont, IWidgetGoalData } from "appTypes";
import "./styles.sass";

const fontsFields: goalDataKeys[] = ["title_font", "progress_font"];

const DonatGoalContainer = () => {
  const { id, name } = useParams();
  const { list } = useAppSelector(({ notifications }) => notifications);

  const [goalData, setGoalData] = useState<IWidgetGoalData | null>(null);
  const [fonts, setFonts] = useState<ISelectItem[]>([]);

  const { data: widgetData, refetch } = useGetGoalsWidgetDataQuery(
    {
      username: name as string,
      id: id as string,
    },
    { skip: !name || !id }
  );

  const getWidgetGoalData = (
    widgetData: IGoalData,
    fontObj?: Record<string, IFont>
  ) =>
    // convert IGoalData -> IWidgetGoalData
    Object.keys(widgetData).reduce((values, key) => {
      const keyField = key as goalDataKeys;
      if (fontsFields.includes(keyField))
        return {
          ...values,
          [keyField]: {
            name: fontObj ? fontObj[keyField] : widgetData[keyField],
          },
        };
      return {
        ...values,
        [keyField]: widgetData[keyField],
      };
    }, initWidgetGoalData);

  useEffect(() => {
    const getGoalWidgetData = async (widgetData: IGoalData) => {
      let loadedFonts;

      if (!fonts.length) {
        const fontsInfo = await getFontsList();

        const { title_font, progress_font } = widgetData;

        loadedFonts = await loadFonts({
          fonts: fontsInfo,
          fields: {
            title_font: title_font,
            progress_font: progress_font,
          },
        });

        setFonts(fontsInfo);
      }
      const widgetDataInfo = getWidgetGoalData(widgetData, loadedFonts);
      setGoalData((prev) => ({ ...prev, ...widgetDataInfo }));
    };

    widgetData && getGoalWidgetData(widgetData);
  }, [widgetData, fonts]);

  useEffect(() => {
    if (list.length && id) {
      const { donation } = list[0];
      if (donation && donation.goal_id === id) refetch();
    }
  }, [list, id]);

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
