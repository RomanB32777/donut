import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, Progress, Row } from "antd";
import clsx from "clsx";
import LinkCopy from "../../../../components/LinkCopy";
import WidgetMobileWrapper from "../../../../components/WidgetMobileWrapper";
import { CopyIcon, PencilIcon, TrashBinIcon } from "../../../../icons/icons";
import ColorPicker from "../../../../components/ColorPicker";
import ConfirmPopup from "../../../../components/ConfirmPopup";
import BaseButton from "../../../../components/BaseButton";
import useWindowDimensions from "../../../../hooks/useWindowDimensions";
import axiosClient, { baseURL } from "../../../../axiosClient";
import { getGoals } from "../../../../store/types/Goals";
import {
  addNotification,
  addSuccessNotification,
  copyStr,
} from "../../../../utils";
import { IGoalData } from "../../../../types";

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
            {/* offset={isTablet ? 5 : 0} */}
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
