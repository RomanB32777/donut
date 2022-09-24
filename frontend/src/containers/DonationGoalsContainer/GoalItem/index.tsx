import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, Progress, Row } from "antd";
import LinkCopy from "../../../components/LinkCopy";
import { PencilIcon, TrashBinIcon } from "../../../icons/icons";
import ColorPicker from "../../../components/ColorPicker";
import ConfirmPopup from "../../../components/ConfirmPopup";
import BaseButton from "../../../commonComponents/BaseButton";
import axiosClient, { baseURL } from "../../../axiosClient";
import { getGoals } from "../../../store/types/Goals";
import { IGoalData } from "../../../types";
import { addNotification, addSuccessNotification } from "../../../utils";
import clsx from "clsx";

interface IEditGoalData {
  title_color: string;
  progress_color: string;
  background_color: string;
}

const GoalItem = ({
  goalData,
  openEditModal,
}: {
  goalData: IGoalData;
  openEditModal?: (data: IGoalData) => void;
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);

  const [isActiveDetails, setisActiveDetails] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [editGoalData, setEditGoalData] = useState<IEditGoalData>({
    title_color: "#ffffff",
    progress_color: "#1D14FF",
    background_color: "#212127",
  });

  const handleActiveDetails = () =>
    !isarchive && setisActiveDetails(!isActiveDetails);

  const clickEditBtn = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    openEditModal && openEditModal(goalData);
  };

  const sendColorsData = async () => {
    try {
      setLoading(true);
      const { id } = goalData;
      const { title_color, progress_color, background_color } = editGoalData;
      await axiosClient.put("/api/user/goals-widget/", {
        goalData: {
          title_color,
          progress_color,
          background_color,
        },
        creator_id: user.id,
        id,
      });
      dispatch(getGoals(user.id));
      addSuccessNotification("Data saved successfully");
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
      await axiosClient.delete("/api/user/goals-widget/" + id);
      dispatch(getGoals(user.id));
      addSuccessNotification("Widget deleted successfully");
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
  const { title_color, progress_color, background_color } = editGoalData;

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
          <Col span={3}>
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
          <Col span={21}>
            <Row
              style={{
                alignItems: "baseline",
                marginTop: 7,
              }}
            >
              <Col span={9}>
                <div className="goals-item__mainInfo">
                  <p className="goals-item__mainInfo_title">{title}</p>
                  <p className="goals-item__mainInfo_description">
                    Raised: {amount_raised}/{amount_goal} USD
                  </p>
                </div>
              </Col>
              <Col span={13}>
                {!isarchive && (
                  <div className="goals-item__link">
                    <LinkCopy
                      link={baseURL + "/donat-goal/" + user.username + "/" + id}
                      isSimple
                    />
                  </div>
                )}
              </Col>
              <Col span={2}>
                <div className="goals-item__btns">
                  {!isarchive && (
                    <div onClick={clickEditBtn} style={{ marginRight: 10 }}>
                      <PencilIcon />
                    </div>
                  )}
                  <div
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
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      {isActiveDetails && (
        <div className="goals-item__details">
          <Row
            gutter={[4, 4]}
            className="goals-item__details-container"
            justify="space-between"
          >
            <Col span={10}>
              <div className="preview-block">
                <div className="preview-block_title">
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
                  className="preview-block_goal"
                  style={{
                    background: background_color,
                  }}
                >
                  <Progress
                    type="circle"
                    percent={75}
                    width={46}
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

                  <p>75 / 100 USD</p>
                </div>
              </div>
            </Col>
            <Col span={13} className="form">
              <div className="form-element">
                <ColorPicker
                  setColor={(color) =>
                    setEditGoalData({ ...editGoalData, title_color: color })
                  }
                  color={title_color}
                  label="Goal title color:"
                  labelCol={9}
                />
              </div>
              <div className="form-element">
                <ColorPicker
                  setColor={(color) =>
                    setEditGoalData({ ...editGoalData, progress_color: color })
                  }
                  color={progress_color}
                  label="Progress bar color:"
                  labelCol={9}
                />
              </div>
              <div className="form-element">
                <ColorPicker
                  setColor={(color) =>
                    setEditGoalData({
                      ...editGoalData,
                      background_color: color,
                    })
                  }
                  color={background_color}
                  label="Background color:"
                  labelCol={9}
                />
              </div>
              <div className="btn-block">
                <BaseButton
                  formatId="profile_form_save_changes_button"
                  padding="6px 35px"
                  onClick={sendColorsData}
                  fontSize="18px"
                  disabled={loading}
                  isBlue
                />
              </div>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
};

export default GoalItem;
