import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, Progress, Row } from "antd";
import LinkCopy from "../../../components/LinkCopy";
import { PencilIcon, TrashBinIcon } from "../../../icons/icons";
import ColorPicker from "../../../components/ColorPicker";
import ConfirmPopup from "../../../components/ConfirmPopup";
import BaseButton from "../../../components/BaseButton";
import axiosClient, { baseURL } from "../../../axiosClient";
import { getGoals } from "../../../store/types/Goals";
import { IGoalData, typesTabContent } from "../../../types";
import {
  addNotification,
  addSuccessNotification,
  copyStr,
} from "../../../utils";
import clsx from "clsx";
import useWindowDimensions from "../../../hooks/useWindowDimensions";
import { TabsComponent } from "../../../components/TabsComponent";

interface IEditGoalData {
  title_color: string;
  progress_color: string;
  background_color: string;
}

const PreviewGoalBlock = ({
  editGoalData,
  goalData,
  loading,
  sendColorsData,
}: {
  editGoalData: IEditGoalData;
  goalData: IGoalData;
  loading: boolean;
  sendColorsData: () => Promise<void>;
}) => {
  const { isLaptop } = useWindowDimensions();
  const { title } = goalData;
  const { title_color, progress_color, background_color } = editGoalData;

  return (
    <Col
      xl={10}
      md={24}
      style={{
        width: "100%",
      }}
    >
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
      {isLaptop && (
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
      )}
    </Col>
  );
};

const SettingsGoalBlock = ({
  editGoalData,
  loading,
  sendColorsData,
  setEditGoalData,
}: {
  editGoalData: IEditGoalData;
  loading: boolean;
  sendColorsData: () => Promise<void>;
  setEditGoalData: (editGoalData: IEditGoalData) => void;
}) => {
  const { title_color, progress_color, background_color } = editGoalData;

  return (
    <Col xl={13} md={24}>
      <Row gutter={[0, 18]} className="form">
        <Col span={24}>
          <div className="form-element">
            <ColorPicker
              setColor={(color) =>
                setEditGoalData({ ...editGoalData, title_color: color })
              }
              color={title_color}
              label="Goal title color:"
              labelCol={9}
              gutter={[0, 18]}
            />
          </div>
        </Col>
        <Col span={24}>
          <div className="form-element">
            <ColorPicker
              setColor={(color) =>
                setEditGoalData({ ...editGoalData, progress_color: color })
              }
              color={progress_color}
              label="Progress bar color:"
              labelCol={9}
              gutter={[0, 18]}
            />
          </div>
        </Col>
        <Col span={24}>
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
              gutter={[0, 18]}
            />
          </div>
        </Col>
      </Row>
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
  );
};

const GoalItem = ({
  goalData,
  openEditModal,
}: {
  goalData: IGoalData;
  openEditModal?: (data: IGoalData) => void;
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const { isLaptop, isTablet, isMobile } = useWindowDimensions();

  const [isActiveDetails, setisActiveDetails] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [editGoalData, setEditGoalData] = useState<IEditGoalData>({
    title_color: "#ffffff",
    progress_color: "#1D14FF",
    background_color: "#212127",
  });

  const [tabContent, setTabContent] = useState<typesTabContent>("all");

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

  useEffect(() => {
    isLaptop ? setTabContent("settings") : setTabContent("all");
  }, [isLaptop]);

  const contents: { type: typesTabContent; content: React.ReactNode }[] = [
    {
      type: "preview",
      content: (
        <PreviewGoalBlock
          editGoalData={editGoalData}
          goalData={goalData}
          loading={loading}
          sendColorsData={sendColorsData}
        />
      ),
    },
    {
      type: "settings",
      content: (
        <SettingsGoalBlock
          editGoalData={editGoalData}
          loading={loading}
          setEditGoalData={setEditGoalData}
          sendColorsData={sendColorsData}
        />
      ),
    },
    {
      type: "all",
      content: (
        <>
          <PreviewGoalBlock
            editGoalData={editGoalData}
            goalData={goalData}
            loading={loading}
            sendColorsData={sendColorsData}
          />
          <SettingsGoalBlock
            editGoalData={editGoalData}
            loading={loading}
            setEditGoalData={setEditGoalData}
            sendColorsData={sendColorsData}
          />
        </>
      ),
    },
  ];

  const { id, title, amount_goal, amount_raised, isarchive } = goalData;
  const { progress_color } = editGoalData;

  const linkForCopy = useMemo(
    () => `${baseURL}/donat-goal/${user.username}/${id}`,
    [baseURL, user, id]
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
          <Col xs={isTablet ? 16 : 21} offset={isMobile ? 5 : 0}>
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
              {!isLaptop && !isarchive && (
                <Col span={2}>
                  <div className="goals-item__btns">
                    <div onClick={clickEditBtn} style={{ marginRight: 10 }}>
                      <PencilIcon />
                    </div>
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
              )}
            </Row>
          </Col>
        </Row>
        {isLaptop && !isarchive && (
          <div className="btn-mobile-block">
            <Row
              gutter={[18, 18]}
              style={{
                width: "100%",
              }}
              justify="center"
            >
              <Col>
                <BaseButton
                  title="Copy link"
                  padding="3px 20px"
                  onClick={clickCopyBtn}
                  fontSize="15px"
                  isBlue
                />
              </Col>
              <Col>
                <BaseButton
                  title="Edit widget"
                  padding="3px 20px"
                  onClick={clickEditBtn}
                  fontSize="15px"
                  disabled={loading}
                  isBlack
                />
              </Col>
              <Col>
                <div
                  onClick={(e?: React.MouseEvent<HTMLDivElement>) =>
                    e && e.stopPropagation()
                  }
                >
                  <ConfirmPopup confirm={deleteGoalWidget}>
                    <BaseButton
                      title="Delete widget"
                      padding="3px 20px"
                      onClick={() => {}}
                      fontSize="15px"
                      disabled={loading}
                      isRed
                    />
                  </ConfirmPopup>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </div>
      {isActiveDetails && (
        <div className="goals-item__details">
          {tabContent !== "all" && (
            <TabsComponent setTabContent={setTabContent} />
          )}
          <Row
            gutter={[4, 4]}
            className="goals-item__details-container"
            justify="space-between"
          >
            {contents.map(
              (block) => block.type === tabContent && block.content
            )}
          </Row>
        </div>
      )}
    </>
  );
};

export default GoalItem;
