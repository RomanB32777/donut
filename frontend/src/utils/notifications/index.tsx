import { Store } from 'react-notifications-component'
import { Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { IBadgeBase, IDonationShortInfo } from 'types'
import { INotification, INotificationMessage, INotificationWithoutType } from './types'
import { formatNumber } from 'utils/appMethods'
import { RoutePaths } from 'consts'

export const addNotification = ({ type, title, message, id }: INotification) => {
	Store.addNotification({
		title,
		message: message || '',
		id,
		type,
		insert: 'top',
		container: 'top-right',
		animationIn: ['animate__animated', 'animate__fadeIn'],
		animationOut: ['animate__animated', 'animate__fadeOut'],
		dismiss: {
			duration: 5000,
			onScreen: true,
		},
	})
}

export const addErrorNotification = ({ message, title }: INotificationWithoutType) =>
	addNotification({
		title: title || 'Error',
		message,
		type: 'danger',
	})

export const addSuccessNotification = ({ message, id }: INotificationWithoutType) =>
	addNotification({
		title: <FormattedMessage id="notification_successfully_title" />,
		message,
		type: 'success',
		id: id || 'success',
	})

export const addNotFoundUserNotification = () =>
	addNotification({
		type: 'danger',
		title: <FormattedMessage id="notification_user_not_found" />,
		id: 'notFound',
	})

export const getDonateNotificationMessage = (
	args: INotificationMessage<IDonationShortInfo>
): React.ReactNode => {
	const { type, user, data } = args
	const { sum, blockchain } = data
	switch (type) {
		case 'donate_creator':
			return (
				<FormattedMessage
					id="notifications_donate_creator"
					values={{ user, sum: formatNumber(sum), blockchain }}
				/>
			)

		case 'donate_supporter':
			return (
				<FormattedMessage
					id="notifications_donate_supporter"
					values={{
						user,
						sum: formatNumber(args.data.sum),
						blockchain: args.data.blockchain,
					}}
				/>
			)

		default:
			return `notification`
	}
}

export const getBadgeNotificationMessage = (
	args: INotificationMessage<IBadgeBase>
): React.ReactNode => {
	const { type, user, data } = args
	const { id, title } = data

	switch (type) {
		case 'add_badge_creator':
			return (
				<FormattedMessage
					id="notifications_add_badge_creator"
					values={{
						user,
						title: (
							<Link
								to={`/${RoutePaths.admin}/${RoutePaths.badges}?id=${id}`}
								style={{ color: '#fff', textDecoration: 'underline' }}
							>
								{title}
							</Link>
						),
					}}
				/>
			)

		case 'add_badge_supporter':
			return (
				<FormattedMessage
					id="notifications_add_badge_supporter"
					values={{
						user,
						title: (
							<Link
								to={`/${RoutePaths.admin}/${RoutePaths.badges}?id=${id}`}
								style={{ color: '#fff', textDecoration: 'underline' }}
							>
								{title}
							</Link>
						),
					}}
				/>
			)

		default:
			return `notification`
	}
}
