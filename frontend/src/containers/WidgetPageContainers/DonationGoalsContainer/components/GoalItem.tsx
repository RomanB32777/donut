import { useState, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { Col, Progress, Row } from "antd";
import clsx from "clsx";
import { goalDataKeys, IGoalData } from "types";

import LinkCopy from "components/LinkCopy";
import WidgetMobileWrapper from "components/WidgetMobileWrapper";
import { CopyIcon, PencilIcon, TrashBinIcon } from "icons";
import ConfirmPopup from "components/ConfirmPopup";
import PreviewGoalBlock from "./PreviewGoalBlock";
import SettingsGoalBlock from "./SettingsGoalBlock";

import { useAppSelector } from "hooks/reduxHooks";
import useWindowDimensions from "hooks/useWindowDimensions";
import axiosClient, { baseURL } from "modules/axiosClient";
import { getGoals } from "store/types/Goals";
import {
  addNotification,
  addSuccessNotification,
  copyStr,
  loadFonts,
} from "utils";
import { ISelectItem } from "components/SelectInput";
import { IWidgetGoalData } from "appTypes";

const GoalItem = ({
  fonts,
  goalData,
  openEditModal,
}: {
  fonts: ISelectItem[];
  goalData: IGoalData;
  openEditModal?: (data: IWidgetGoalData) => void;
}) => {
  const dispatch = useDispatch();
  const user = useAppSelector(({ user }) => user);
  const { isLaptop, isTablet } = useWindowDimensions();

  const [isActiveDetails, setisActiveDetails] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [editGoalData, setEditGoalData] = useState<IWidgetGoalData>({
    ...goalData,
    title_font: {
      name: goalData.title_font,
      link: "",
    },
    progress_font: {
      name: goalData.progress_font,
      link: "",
    },
  });

  const { id, title, amount_goal, amount_raised, is_archive, progress_color } =
    editGoalData;

  const handleActiveDetails = () =>
    !is_archive && setisActiveDetails(!isActiveDetails);

  const clickEditBtn = (event?: React.MouseEvent<HTMLDivElement>) => {
    event && event.stopPropagation();
    openEditModal && openEditModal(editGoalData);
  };

  const clickCopyBtn = (event?: React.MouseEvent<HTMLDivElement>) => {
    event && event.stopPropagation();
    copyStr(linkForCopy);
  };

  const initGoalItem = async () => {
    if (fonts) {
      const { title_font, progress_font } = goalData;

      const loadedFonts = await loadFonts({
        fonts,
        fields: { title_font, progress_font },
      });

      // convert IGoalData -> IWidgetGoalData
      const goalItemValues = Object.keys(goalData).reduce(
        (values, key) => ({
          ...values,
          [key]: goalData[key as goalDataKeys],
        }),
        editGoalData
      );
      setEditGoalData({ ...goalItemValues, ...loadedFonts });
    }
  };

  const editWidgetData = async () => {
    try {
      setLoading(true);
      const { id } = goalData;
      const { title_font, progress_font } = editGoalData;
      await axiosClient.put("/api/widget/goals-widget/", {
        goalData: {
          ...editGoalData,
          title_font: title_font.name,
          progress_font: progress_font.name,
        },
        creator_id: user.id,
        id,
      });
      dispatch(getGoals(user.id));
      addSuccessNotification({ message: "Data saved successfully" });
    } catch (error) {
      addNotification({
        type: "danger",
        title: "Error",
        message:
          (error as any)?.response?.data?.message ||
          `An error occurred while saving data`,
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteGoalWidget = async () => {
    try {
      setLoading(true);
      const { id } = goalData;
      await axiosClient.delete("/api/widget/goals-widget/" + id);
      dispatch(getGoals(user.id));
      addSuccessNotification({ message: "Widget deleted successfully" });
    } catch (error) {
      addNotification({
        type: "danger",
        title: "Error",
        message:
          (error as any)?.response?.data?.message ||
          `An error occurred while deleting data`,
      });
    } finally {
      setLoading(false);
    }
  };

  const linkForCopy = useMemo(
    () => `${baseURL}/donat-goal/${user.username}/${id}`,
    [user, id]
  );

  useEffect(() => {
    fonts && fonts.length && initGoalItem();
  }, [fonts, goalData]);

  return (
    <>
      <div
        className={clsx("goals-item", {
          active: isActiveDetails,
        })}
        style={{
          cursor: !is_archive ? "pointer" : "auto",
        }}
        onClick={handleActiveDetails}
      >
        <Row>
          <Col xs={3}>
            <Progress
              type="circle"
              percent={Math.round((amount_raised / amount_goal) * 100)}
              width={83}
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
          </Col>
          <Col
            xs={{ span: isTablet ? 16 : 18, offset: 5 }}
            sm={{ offset: 2 }}
            lg={{ offset: 0 }}
          >
            <Row
              style={{
                alignItems: "baseline",
                marginTop: 7,
              }}
            >
              <Col xl={9} xs={24}>
                <div className="goals-item__mainInfo">
                  <p className="goals-item__mainInfo_title">{title}</p>
                  <p className="goals-item__mainInfo_description">
                    Raised: {amount_raised}/{amount_goal} USD
                  </p>
                </div>
              </Col>
              {!isLaptop && (
                <Col span={13}>
                  {!is_archive && (
                    <div className="goals-item__link">
                      <LinkCopy link={linkForCopy} isSimple />
                    </div>
                  )}
                </Col>
              )}
            </Row>
          </Col>
          <div className="goals-item__btns">
            {isLaptop && !is_archive && (
              <div className="goals-item__btns_item" onClick={clickCopyBtn}>
                <CopyIcon />
              </div>
            )}
            {!is_archive && (
              <div
                className="goals-item__btns_item"
                onClick={clickEditBtn}
                style={{ marginRight: 10 }}
              >
                <PencilIcon />
              </div>
            )}
            <div
              className="goals-item__btns_item"
              onClick={(e: React.MouseEvent<HTMLDivElement>) =>
                e.stopPropagation()
              }
            >
              <ConfirmPopup confirm={deleteGoalWidget}>
                <div>
                  <TrashBinIcon />
                </div>
              </ConfirmPopup>
            </div>
          </div>
        </Row>
      </div>
      {isActiveDetails && (
        <div className="goals-item__details">
          <WidgetMobileWrapper
            previewBlock={
              <PreviewGoalBlock
                loading={loading}
                editGoalData={editGoalData}
                editWidgetData={editWidgetData}
              />
            }
            settingsBlock={
              <SettingsGoalBlock
                fonts={fonts}
                loading={loading}
                editGoalData={editGoalData}
                setEditGoalData={setEditGoalData}
                editWidgetData={editWidgetData}
              />
            }
          />
        </div>
      )}
    </>
  );
};

export default GoalItem;
