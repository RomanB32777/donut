import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Badge } from 'antd'

import { useActions, useAppSelector } from 'hooks/reduxHooks'
import { FormattedMessage } from 'react-intl'

import useOnClickOutside from 'hooks/useClickOutside'
import NotificationItem from './components/NotificationItem'
import { AlertIcon } from 'icons'

import { useGetNotificationsQuery, useDeleteAllMutation } from 'store/services/NotificationsService'
import './styles.sass'

const NotificationsPopup = () => {
	const { setNotifications } = useActions()
	const { list } = useAppSelector(({ notifications }) => notifications)
	const { username, creator } = useAppSelector(({ user }) => user)

	const contentRef = useRef<HTMLDivElement>(null)
	const blockRef = useRef(null)

	const [isNotificationPopupOpened, setNotificationPopupOpened] = useState(false)

	const { refetch } = useGetNotificationsQuery(
		{
			username,
			shouldUpdateApp: false,
			spamFilter: creator?.spamFilter,
		},
		{ skip: !username }
	)
	const [deleteAll, { isSuccess }] = useDeleteAllMutation()

	const handlerNotificationPopup = useCallback(
		() => setNotificationPopupOpened((prev) => !prev),
		[]
	)

	const clearAll = async () => await deleteAll()

	useOnClickOutside(isNotificationPopupOpened, blockRef, handlerNotificationPopup)

	// const unreadedNotificationsCount = useMemo(
	//   () => list.filter(({ read }) => !read).length,
	//   [list]
	// );

	const unreadedNotificationsCount = useMemo(
		() =>
			list.filter(({ users }) =>
				users.some(({ user, read }) => user.username === username && !read)
			).length,
		[list, username]
	)

	useEffect(() => {
		isNotificationPopupOpened && refetch()
	}, [isNotificationPopupOpened])

	useEffect(() => {
		isSuccess &&
			setNotifications({
				list: [],
				shouldUpdateApp: false,
			})
	}, [isSuccess])

	return (
		<div className="notifications" ref={blockRef}>
			<div className="icon icon-notifications" onClick={handlerNotificationPopup}>
				<Badge count={unreadedNotificationsCount}>
					<AlertIcon />
				</Badge>
			</div>

			{isNotificationPopupOpened && (
				<div className="popup">
					<div className="wrapper fadeIn">
						{Boolean(list.length) && (
							<div className="popup-header">
								<p>
									<FormattedMessage id="notifications_title" />
								</p>
								<p className="all-read" onClick={clearAll}>
									<FormattedMessage id="notifications_clear" />
								</p>
							</div>
						)}
						<div className="content">
							<div
								className="list"
								style={{
									overflowY: list.length >= 9 ? 'scroll' : 'auto',
								}}
								ref={contentRef}
							>
								{list.map((n) => (
									<NotificationItem
										key={n.id}
										username={username}
										notification={n}
										handlerNotificationPopup={handlerNotificationPopup}
									/>
								))}
								{!list.length && (
									<div
										className="item"
										style={{
											textAlign: 'center',
										}}
									>
										<Badge dot={false} className="dot">
											<FormattedMessage id="notifications_no" />
										</Badge>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default memo(NotificationsPopup)
