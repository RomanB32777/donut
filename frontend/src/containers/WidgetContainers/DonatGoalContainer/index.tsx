import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Progress } from "antd";
import { goalDataKeys, IGoalData } from "types";

import { useAppSelector } from "hooks/reduxHooks";
import { useGetGoalsWidgetDataQuery } from "store/services/GoalsService";
import { getFontColorStyles, getFontsList, loadFonts } from "utils";
import { initWidgetGoalData } from "consts";
import { ISelectItem } from "components/SelectInput";
import { IFont, IWidgetGoalData } from "appTypes";
import "./styles.sass";

const fontsFields: goalDataKeys[] = ["titleFont", "progressFont"];

const DonateGoalContainer = () => {
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
    fontObj: Record<string, IFont>
  ) => {
    // convert IGoalData -> IWidgetGoalData
    return Object.keys(widgetData).reduce((values, key) => {
      const keyField = key as goalDataKeys;
      if (fontsFields.includes(keyField)) {
        return {
          ...values,
          [keyField]: fontObj[keyField],
        };
      }
      return {
        ...values,
        [keyField]: widgetData[keyField],
      };
    }, initWidgetGoalData);
  };

  useEffect(() => {
    const loadWidgetFonts = async (widgetData: IGoalData) => {
      let loadedFonts: ISelectItem<string>[] = [];

      if (!fonts.length) {
        loadedFonts = await getFontsList();
        setFonts(loadedFonts);
      }

      const { titleFont, progressFont } = widgetData;
      return await loadFonts({
        fonts: fonts.length ? fonts : loadedFonts,
        fields: { titleFont, progressFont },
      });
    };

    const getGoalWidgetData = async (widgetData: IGoalData) => {
      const loadedFonts = await loadWidgetFonts(widgetData);
      const widgetDataInfo = getWidgetGoalData(widgetData, loadedFonts);
      setGoalData((prev) => ({ ...prev, ...widgetDataInfo }));
    };

    widgetData && getGoalWidgetData(widgetData);
  }, [widgetData, fonts]);

  useEffect(() => {
    if (list.length && id) {
      const { donation } = list[0];
      if (donation && donation?.goal?.id === id) refetch();
    }
  }, [list, id]);

  if (goalData) {
    const {
      title,
      titleColor,
      titleFont,
      progressColor,
      progressFont,
      backgroundColor,
      amountGoal,
      amountRaised,
    } = goalData;

    return (
      <div className="donat-goal">
        <div className="donat-goal_container">
          <div className="donat-goal_title">
            <p>
              <span style={getFontColorStyles(titleColor, titleFont)}>
                {title}
              </span>
            </p>
          </div>
          <div
            className="donat-goal_progress"
            style={{
              background: backgroundColor,
            }}
          >
            <Progress
              type="circle"
              percent={Math.round((amountRaised / amountGoal) * 100)}
              width={150}
              strokeColor={progressColor}
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
            <p style={getFontColorStyles("#fff", progressFont)}>
              {amountRaised} / {amountGoal} USD
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <></>;
};

export default DonateGoalContainer;
