import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, Progress, Row } from "antd";
import clsx from "clsx";
import { IGoalData } from "types";

import LinkCopy from "../../../../components/LinkCopy";
import WidgetMobileWrapper from "../../../../components/WidgetMobileWrapper";
import { CopyIcon, PencilIcon, TrashBinIcon } from "../../../../icons";
import ConfirmPopup from "../../../../components/ConfirmPopup";
import PreviewGoalBlock from "./PreviewGoalBlock";
import SettingsGoalBlock from "./SettingsGoalBlock";

import useWindowDimensions from "../../../../hooks/useWindowDimensions";
import axiosClient, { baseURL } from "../../../../modules/axiosClient";
import { getGoals } from "../../../../store/types/Goals";
import {
  addNotification,
  addSuccessNotification,
  copyStr,
} from "../../../../utils";
import { IEditGoalData } from "appTypes";

const GoalItem = ({
  goalData,
  openEditModal,
}: {
  goalData: IGoalData;
  openEditModal?: (data: IGoalData) => void;
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const { isLaptop, isTablet } = useWindowDimensions();

  const [isActiveDetails, setisActiveDetails] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [editGoalData, setEditGoalData] = useState<IEditGoalData>({
    title_color: "#ffffff",
    progress_color: "#1D14FF",
    background_color: "#212127",
  });

  const handleActiveDetails = () =>
    !isarchive && setisActiveDetails(!isActiveDetails);

  const clickEditBtn = (event?: React.MouseEvent<HTMLDivElement>) => {
    event && event.stopPropagation();
    openEditModal && openEditModal(goalData);
  };

  const clickCopyBtn = (event?: React.MouseEvent<HTMLDivElement>) => {
    event && event.stopPropagation();
    copyStr(linkForCopy);
  };

  const sendColorsData = async () => {
    try {
      setLoading(true);
      const { id } = goalData;
      const { title_color, progress_color, background_color } = editGoalData;
      await axiosClient.put("/api/widget/goals-widget/", {
        goalData: {
          title_color,
          progress_color,
          background_color,
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

  useEffect(() => {
    const { title_color, progress_color, background_color } = goalData;
    setEditGoalData({
      title_color,
      progress_color,
      background_color,
    });
  }, []);

  const { id, title, amount_goal, amount_raised, isarchive } = goalData;
  const { progress_color } = editGoalData;

  const linkForCopy = useMemo(
    () => `${baseURL}/donat-goal/${user.username}/${id}`,
    [user, id]
  );

  return (
    <>
      <div
        className={clsx("goals-item", {
          active: isActiveDetails,
        })}
        style={{
          cursor: !isarchive ? "pointer" : "auto",
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
                  {!isarchive && (
                    <div className="goals-item__link">
                      <LinkCopy link={linkForCopy} isSimple />
                    </div>
                  )}
                </Col>
              )}
            </Row>
          </Col>
          <div className="goals-item__btns">
            {isLaptop && !isarchive && (
              <div className="goals-item__btns_item" onClick={clickCopyBtn}>
                <CopyIcon />
              </div>
            )}
            {!isarchive && (
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
                editGoalData={editGoalData}
                goalData={goalData}
                loading={loading}
                sendColorsData={sendColorsData}
              />
            }
            settingsBlock={
              <SettingsGoalBlock
                editGoalData={editGoalData}
                loading={loading}
                setEditGoalData={setEditGoalData}
                sendColorsData={sendColorsData}
              />
            }
          />
        </div>
      )}
    </>
  );
};

export default GoalItem;
