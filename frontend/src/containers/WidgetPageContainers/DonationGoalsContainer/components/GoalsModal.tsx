import { useState } from "react";
import { Col, Row } from "antd";
import { useDispatch } from "react-redux";

import { useAppSelector } from "hooks/reduxHooks";
import BaseButton from "components/BaseButton";
import FormInput from "components/FormInput";
import ModalComponent from "components/ModalComponent";
import axiosClient from "modules/axiosClient";
import { getGoals } from "store/types/Goals";
import { addNotification, addSuccessNotification } from "utils";
import { initWidgetGoalData } from "consts";
import { IWidgetGoalData } from "appTypes";

const GoalsModal = ({
  formData,
  isOpenModal,
  setFormData,
  setIsOpenModal,
}: {
  formData: IWidgetGoalData;
  isOpenModal: boolean;
  setFormData: (formData: IWidgetGoalData) => void;
  setIsOpenModal: (status: boolean) => void;
}) => {
  const dispatch = useDispatch();
  const { user } = useAppSelector((state) => state);
  const [loading, setLoading] = useState(false);

  const { amount_goal, title } = formData;

  const closeEditModal = () => {
    setFormData({
      ...initWidgetGoalData,
    });
    setIsOpenModal(false);
  };

  const sendData = async () => {
    try {
      setLoading(true);
      const { amount_goal, title, id } = formData;
      id
        ? await axiosClient.put("/api/widget/goals-widget/", {
            goalData: {
              title,
              amount_goal,
            },
            creator_id: user.id,
            id,
          })
        : await axiosClient.post("/api/widget/goals-widget/", {
            title,
            amount_goal,
            creator_id: user.id,
          });
      dispatch(getGoals(user.id));
      setIsOpenModal(false);
      setFormData({
        ...initWidgetGoalData,
      });
      addSuccessNotification({ message: "Data created successfully" });
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

  return (
    <ModalComponent
      open={isOpenModal}
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
                value={title}
                setValue={(value) => setFormData({ ...formData, title: value })}
                labelCol={6}
                inputCol={14}
                gutter={[0, 18]}
              />
            </div>
          </Col>
          <Col span={24}>
            <div className="form-element">
              <FormInput
                label="Amount to raise:"
                name="widgetAmount"
                value={String(amount_goal)}
                typeInput="number"
                setValue={(value) =>
                  setFormData({ ...formData, amount_goal: +value })
                }
                addonAfter={<span>USD</span>}
                labelCol={6}
                inputCol={10}
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
              isMain
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
  );
};

export default GoalsModal;
