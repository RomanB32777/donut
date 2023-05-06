import { createApi } from '@reduxjs/toolkit/query/react'
import { INotification } from 'types'
import { baseQuery } from './utils'
import { INotificationParams } from 'appTypes'

const notificationsApi = createApi({
	reducerPath: 'notificationApi',
	baseQuery: baseQuery({
		apiURL: 'api/notifications',
	}),
	refetchOnFocus: true,
	tagTypes: ['notifications'],
	endpoints: (build) => ({
		getNotifications: build.query<INotification[], INotificationParams>({
			query: ({ shouldUpdateApp, username, ...query }) => ({
				url: `/${username}`,
				params: query,
			}),
			providesTags: ['notifications'],
		}),

		setStatusNotification: build.mutation<INotification, string>({
			query: (id) => ({
				url: `/${id}`,
				params: { isVisibleNotification: false },
				method: 'PATCH',
			}),
			invalidatesTags: ['notifications'],
		}),

		deleteNotification: build.mutation<INotification, string>({
			query: (id) => ({
				url: `/${id}`,
				params: { isVisibleNotification: false },
				method: 'DELETE',
			}),
			invalidatesTags: ['notifications'],
		}),

		deleteAll: build.mutation<[], void>({
			query: () => ({
				url: '/',
				method: 'DELETE',
			}),
			invalidatesTags: ['notifications'],
		}),
	}),
})

export const {
	useGetNotificationsQuery,
	useLazyGetNotificationsQuery,
	useSetStatusNotificationMutation,
	useDeleteNotificationMutation,
	useDeleteAllMutation,
} = notificationsApi

export default notificationsApi
