import { createApi } from '@reduxjs/toolkit/query/react'
import { FileUploadTypes, IAlertData, IEditAlertData, IStaticFile } from 'types'
import { setFormDataValues } from 'utils'
import { baseQuery } from './utils'

interface IEditCreatorInfo extends IEditAlertData {
	[FileUploadTypes.alert]?: File | null
}

const alertsApi = createApi({
	reducerPath: 'alertsApi',
	baseQuery: baseQuery({
		apiURL: 'api/widgets/alerts',
	}),
	tagTypes: ['alerts'],
	endpoints: (build) => ({
		getAlertWidgetData: build.query<IAlertData, string>({
			query: (id) => `/${id}`,
			providesTags: ['alerts'],
		}),

		getAlertWidgetDataByCreator: build.query<IAlertData, string>({
			query: (userId) => `creator/${userId}`,
			providesTags: ['alerts'],
		}),

		editAlertsWidget: build.mutation<IAlertData, IEditCreatorInfo>({
			query: ({ id, ...alertInfo }) => {
				const formData = new FormData()
				setFormDataValues({
					formData,
					dataValues: alertInfo,
				})
				return {
					url: `/${id}`,
					method: 'PATCH',
					body: formData,
				}
			},
			// async onQueryStarted(alertInfo, { dispatch, queryFulfilled }) {
			//   if (alertInfo.username && alertInfo.data) {
			//     const patchResult = dispatch(
			//       alertsApi.util.updateQueryData(
			//         "getAlertWidgetData",
			//         { username: alertInfo.username, id: alertInfo?.data?.id },
			//         (draft) => {
			//           Object.assign(draft, alertInfo.data);
			//         }
			//       )
			//     );
			//     try {
			//       await queryFulfilled;
			//     } catch {
			//       patchResult.undo();
			//     }
			//   }
			// },

			invalidatesTags: ['alerts'],
		}),

		uploadSound: build.mutation<IStaticFile, { [FileUploadTypes.sound]: File | null }>({
			query: (soundInfo) => {
				const formData = new FormData()
				setFormDataValues({ formData, dataValues: soundInfo })

				return {
					url: '/sound',
					method: 'POST',
					body: formData,
				}
			},
		}),
	}),
})

export const {
	useGetAlertWidgetDataQuery,
	useLazyGetAlertWidgetDataQuery,
	useGetAlertWidgetDataByCreatorQuery,
	useLazyGetAlertWidgetDataByCreatorQuery,
	useEditAlertsWidgetMutation,
	useUploadSoundMutation,
} = alertsApi

export default alertsApi
