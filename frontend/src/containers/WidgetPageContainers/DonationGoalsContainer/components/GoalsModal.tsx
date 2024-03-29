import { FC, memo, useContext } from 'react'
import { Col, Row } from 'antd'
import { FormattedMessage } from 'react-intl'
import { ISocketEmitObj } from 'types'

import { useAppSelector } from 'hooks/reduxHooks'
import BaseButton from 'components/BaseButton'
import FormInput from 'components/FormInput'
import ModalComponent from 'components/ModalComponent'

import { useCreateGoalMutation, useEditGoalMutation } from 'store/services/GoalsService'
import { WebSocketContext } from 'contexts/Websocket'
import { initWidgetGoalData } from 'consts'
import { IWidgetGoalData } from 'appTypes'

interface IGoalsModal {
	formData: IWidgetGoalData
	isOpenModal: boolean
	setFormData: (formData: IWidgetGoalData) => void
	setIsOpenModal: (status: boolean) => void
}

const labelCol = 7

const GoalsModal: FC<IGoalsModal> = ({ formData, isOpenModal, setFormData, setIsOpenModal }) => {
	const { id: userID, username } = useAppSelector(({ user }) => user)
	const [editGoal, { isLoading: isEditLoading }] = useEditGoalMutation()
	const [createGoal, { isLoading: isCreateLoading }] = useCreateGoalMutation()
	const socket = useContext(WebSocketContext)

	const { id, amountGoal, title } = formData

	const closeEditModal = () => {
		setFormData({
			...initWidgetGoalData,
		})
		setIsOpenModal(false)
	}

	const sendData = async () => {
		try {
			if (id) {
				await editGoal({
					title,
					amountGoal,
					id,
				})

				if (socket) {
					const emitObj: ISocketEmitObj = {
						id,
						toSendUsername: username,
						type: 'change_goal',
					}
					socket.emit('widgetChange', emitObj)
				}
			} else {
				await createGoal({ title, amountGoal, creator: userID })
			}

			setIsOpenModal(false)
			setFormData({
				...initWidgetGoalData,
			})
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<ModalComponent
			open={isOpenModal}
			title={<FormattedMessage id="goals_modal_title" />}
			onCancel={closeEditModal}
			width={880}
		>
			<div className="modal">
				<Row gutter={[0, 18]} className="form" justify="center">
					<Col span={24}>
						<div className="form-element">
							<FormInput
								label={<FormattedMessage id="goals_modal_form_description" />}
								name="widgetDescription"
								value={title}
								setValue={(value) => setFormData({ ...formData, title: value })}
								labelCol={labelCol}
								inputCol={14}
								gutter={[0, 18]}
							/>
						</div>
					</Col>
					<Col span={24}>
						<div className="form-element">
							<FormInput
								label={<FormattedMessage id="goals_modal_form_amount" />}
								name="widgetAmount"
								value={String(amountGoal)}
								typeInput="number"
								setValue={(value) => setFormData({ ...formData, amountGoal: +value })}
								addonAfter={<span>USD</span>}
								labelCol={labelCol}
								inputCol={10}
								gutter={[0, 18]}
							/>
						</div>
					</Col>
				</Row>
				<div className="btns">
					<div className="save">
						<BaseButton
							formatId="form_save_goal_button"
							padding="6px 35px"
							onClick={sendData}
							fontSize="18px"
							disabled={isEditLoading || isCreateLoading}
							isMain
						/>
					</div>
					<div className="cancel">
						<BaseButton
							formatId="form_cancel_button"
							padding="6px 35px"
							onClick={closeEditModal}
							fontSize="18px"
						/>
					</div>
				</div>
			</div>
		</ModalComponent>
	)
}

export default memo(GoalsModal)
