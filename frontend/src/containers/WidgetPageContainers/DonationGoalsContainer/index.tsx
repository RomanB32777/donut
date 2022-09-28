import { Col, Empty, Row } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../../../axiosClient";
import BaseButton from "../../../components/BaseButton";
import PageTitle from "../../../components/PageTitle";
import FormInput from "../../../components/FormInput";
import ModalComponent from "../../../components/ModalComponent";
import { getGoals } from "../../../store/types/Goals";
import { IGoalData } from "../../../types";
import { addNotification, addSuccessNotification } from "../../../utils";
import GoalItem from "./GoalItem";

import "./styles.sass";

interface IWidgetGoalData {
  widgetAmount: string;
  widgetDescription: string;
  id?: number;
}

const initWidgetGoalData: IWidgetGoalData = {
  widgetAmount: "0",
  widgetDescription: "",
};

const DonationGoalsContainer = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const notifications = useSelector((state: any) => state.notifications);

  const goals = useSelector((state: any) => state.goals);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<IWidgetGoalData>({
    ...initWidgetGoalData,
  });

  const openEditModal = (widget: IGoalData) => {
    const { id, amount_goal, title } = widget;
    setFormData({
      id,
      widgetAmount: String(amount_goal),
      widgetDescription: title,
    });
    setIsOpenModal(true);
  };

  const closeEditModal = () => {
    setFormData({
      ...initWidgetGoalData,
    });
    setIsOpenModal(false);
  };

  const sendData = async () => {
    try {
      setLoading(true);
      const { widgetDescription, widgetAmount, id } = formData;
      id
        ? await axiosClient.put("/api/user/goals-widget/", {
            goalData: {
              title: widgetDescription,
              amount_goal: +widgetAmount,
            },
            creator_id: user.id,
            id,
          })
        : await axiosClient.post("/api/user/goals-widget/", {
            title: widgetDescription,
            amount_goal: +widgetAmount,
            creator_id: user.id,
          });
      dispatch(getGoals(user.id));
      setIsOpenModal(false);
      setFormData({
        ...initWidgetGoalData,
      });
      addSuccessNotification("Data created successfully");
    } catch (error) {
      addNotification({
        type: "danger",
        title: "Error",
        message:
          (error as any)?.response?.data?.message ||
          `An error occurred while creating data`,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    user.id && dispatch(getGoals(user.id));
  }, [user, notifications]);

  const { widgetAmount, widgetDescription } = formData;

  return (
    <div className="donationGoalsPage-container">
      <PageTitle formatId="page_title_donation_goals" />
      <div className="goals-header">
        <p className="subtitle">
          Start fundraising for a specific purchase or goal.
        </p>
        <BaseButton
          formatId="create_new_form_button"
          padding="6px 35px"
          onClick={() => setIsOpenModal(true)}
          fontSize="18px"
          isBlue
        />
      </div>
      <div className="goals-wrapper">
        {Boolean(goals.length) &&
        Boolean(goals.filter((goal: IGoalData) => !goal.isarchive).length) ? (
          goals
            .filter((goal: IGoalData) => !goal.isarchive)
            .reverse()
            .map((goal: IGoalData) => (
              <GoalItem
                key={goal.id}
                goalData={goal}
                openEditModal={openEditModal}
              />
            ))
        ) : (
          <Empty className="empty-el" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </div>
      <PageTitle formatId="page_title_donation_history" />
      <div className="goals-archiveWrapper">
        {Boolean(goals.length) &&
        Boolean(goals.filter((goal: IGoalData) => goal.isarchive).length) ? (
          goals
            .filter((goal: IGoalData) => goal.isarchive)
            .reverse()
            .map((goal: IGoalData) => (
              <GoalItem key={goal.id} goalData={goal} />
            ))
        ) : (
          <Empty className="empty-el" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </div>
      <ModalComponent
        visible={isOpenModal}
        title="New donation goal"
        onCancel={closeEditModal}
        width={880}
      >
        <div className="goals-modal">
          <Row gutter={[0, 18]} className="goals-modal__form" justify="center">
            <Col span={24}>
              <div className="form-element">
                <FormInput
                  label="Goal description:"
                  name="widgetDescription"
                  value={widgetDescription}
                  setValue={(value) =>
                    setFormData({ ...formData, widgetDescription: value })
                  }
                  labelCol={6}
                  InputCol={14}
                  gutter={[0, 18]}
                />
              </div>
            </Col>
            <Col span={24}>
              <div className="form-element">
                <FormInput
                  label="Amount to raise:"
                  name="widgetAmount"
                  value={widgetAmount}
                  typeInput="number"
                  setValue={(value) =>
                    setFormData({ ...formData, widgetAmount: value })
                  }
                  addonAfter={<span>USD</span>}
                  labelCol={6}
                  InputCol={10}
                  gutter={[0, 18]}
                />
              </div>
            </Col>
          </Row>
          <div className="goals-modal__btns">
            <div className="goals-modal__btns_save">
              <BaseButton
                formatId="profile_form_save_goal_button"
                padding="6px 35px"
                onClick={sendData}
                fontSize="18px"
                disabled={loading}
                isBlue
              />
            </div>
            <div className="goals-modal__btns_cancel">
              <BaseButton
                formatId="profile_form_cancel_button"
                padding="6px 35px"
                onClick={closeEditModal}
                fontSize="18px"
              />
            </div>
          </div>
        </div>
      </ModalComponent>
    </div>
  );
};

export default DonationGoalsContainer;
