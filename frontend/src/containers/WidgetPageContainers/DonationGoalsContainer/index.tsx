import { useCallback, useEffect, useMemo, useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { useAppSelector } from 'hooks/reduxHooks'
import BaseButton from 'components/BaseButton'
import PageTitle from 'components/PageTitle'
import GoalItem from './components/GoalItem'
import GoalsModal from './components/GoalsModal'
import EmptyComponent from 'components/EmptyComponent'

import { useGetGoalsQuery } from 'store/services/GoalsService'
import { getFontsList } from 'utils'
import { initWidgetGoalData } from 'consts'
import { ISelectItem } from 'components/SelectInput'
import { IWidgetGoalData } from 'appTypes'
import './styles.sass'

const DonationGoalsContainer = () => {
	const { id } = useAppSelector(({ user }) => user)
	const { list } = useAppSelector(({ notifications }) => notifications)

	const [isOpenModal, setIsOpenModal] = useState(false)
	const [formData, setFormData] = useState<IWidgetGoalData>(initWidgetGoalData)
	const [fonts, setFonts] = useState<ISelectItem[]>([])

	const { data: goals, refetch } = useGetGoalsQuery({ userId: id }, { skip: !id })

	const openEditModal = useCallback((widget: IWidgetGoalData) => {
		setFormData(widget)
		setIsOpenModal(true)
	}, [])

	const openCreateModal = useCallback(() => {
		setFormData(initWidgetGoalData)
		setIsOpenModal(true)
	}, [])

	const activeGoals = useMemo(() => (goals ? goals.filter((goal) => !goal.isArchive) : []), [goals])

	const archivedGoals = useMemo(
		() => (goals ? goals.filter((goal) => goal.isArchive) : []),
		[goals]
	)

	useEffect(() => {
		const initFonts = async () => {
			const fonts = await getFontsList()
			setFonts(fonts)
		}

		initFonts()
	}, [])

	useEffect(() => {
		// list.length &&
		refetch()
	}, [list])

	return (
		<div className="goals fadeIn">
			<PageTitle formatId="page_title_donation_goals" />
			<div className="headerPage">
				<p className="subtitle">
					<FormattedMessage id="goals_subtitle" />
				</p>
				<BaseButton
					formatId="create_new_form_button"
					padding="6px 35px"
					onClick={openCreateModal}
					fontSize="18px"
					isMain
				/>
			</div>
			<div className="wrapper">
				{activeGoals.length ? (
					activeGoals.map((goal) => (
						<GoalItem key={goal.id} fonts={fonts} goalData={goal} openEditModal={openEditModal} />
					))
				) : (
					<EmptyComponent />
				)}
			</div>
			<PageTitle formatId="page_title_donation_history" />
			<div className="archiveWrapper">
				{archivedGoals.length ? (
					archivedGoals.map((goal) => <GoalItem key={goal.id} goalData={goal} fonts={[]} />)
				) : (
					<EmptyComponent />
				)}
			</div>
			<GoalsModal
				formData={formData}
				isOpenModal={isOpenModal}
				setFormData={setFormData}
				setIsOpenModal={setIsOpenModal}
			/>
		</div>
	)
}

export default DonationGoalsContainer
