import { INotification, INotificationQueries } from 'types'

export interface INotificationsState {
	list: INotification[]
	shouldUpdateApp: boolean
}

export interface INotificationParams extends INotificationQueries {
	username: string
	shouldUpdateApp?: boolean
}

export interface IVisibleNotification {
	isVisibleNotification?: boolean
}
