import { FC, memo } from "react";
import { Col, Row } from "antd";

import { useAppSelector } from "hooks/reduxHooks";
import BaseButton from "components/BaseButton";
import FormInput from "components/FormInput";
import ModalComponent from "components/ModalComponent";

import {
  useCreateGoalMutation,
  useEditGoalMutation,
} from "store/services/GoalsService";
import { initWidgetGoalData } from "consts";
import { IWidgetGoalData } from "appTypes";

interface IGoalsModal {
  formData: IWidgetGoalData;
  isOpenModal: boolean;
  setFormData: (formData: IWidgetGoalData) => void;
  setIsOpenModal: (status: boolean) => void;
}

const GoalsModal: FC<IGoalsModal> = ({
  formData,
  isOpenModal,
  setFormData,
  setIsOpenModal,
}) => {
  const { id: userID } = useAppSelector(({ user }) => user);
  const [editGoal, { isLoading: isEditLoading }] = useEditGoalMutation();
  const [createGoal, { isLoading: isCreateLoading }] = useCreateGoalMutation();

  const { id, amount_goal, title } = formData;

  const closeEditModal = () => {
    setFormData({
      ...initWidgetGoalData,
    });
    setIsOpenModal(false);
  };

  const sendData = async () => {
    try {
      id
        ? await editGoal({
            goalData: {
              title,
              amount_goal,
              creator_id: userID,
            },
            id,
          })
        : await createGoal({ title, amount_goal, creator_id: userID });

      setIsOpenModal(false);
      setFormData({
        ...initWidgetGoalData,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ModalComponent
      open={isOpenModal}
      title="New donation goal"
      onCancel={closeEditModal}
      width={880}
    >
      <div className="modal">
        <Row gutter={[0, 18]} className="form" justify="center">
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
        <div className="btns">
          <div className="save">
            <BaseButton
              formatId="profile_form_save_goal_button"
              padding="6px 35px"
              onClick={sendData}
              fontSize="18px"
              disabled={isEditLoading || isCreateLoading}
              isMain
            />
          </div>
          <div className="cancel">
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

export default memo(GoalsModal);
