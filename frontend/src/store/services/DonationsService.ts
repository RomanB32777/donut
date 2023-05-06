import { createApi } from '@reduxjs/toolkit/query/react'
import {
	IDonation,
	donationsQueryData,
	IFullSendDonat,
	IShortUserData,
	statsDataTypes,
} from 'types'
import { baseQuery } from './utils'
import { IDonationWidgetInfo } from 'appTypes'

interface IDonationsGetParams {
	userId?: string
	dataType?: statsDataTypes | 'stats'
	query?: Partial<donationsQueryData>
}

const donationsApi = createApi({
	reducerPath: 'donationsApi',
	baseQuery: baseQuery({
		apiURL: 'api/donations',
	}),
	tagTypes: ['donations'],
	endpoints: (build) => ({
		getWidgetDonations: build.query<any[], IDonationsGetParams>({
			query: ({ dataType, userId, query }) => ({
				url: `widgets/${dataType}/${userId}`,
				params: query,
			}),
			providesTags: ['donations'],
		}),

		getDonationsPage: build.query<IDonationWidgetInfo[], IDonationsGetParams>({
			query: ({ query }) => ({
				url: 'page',
				params: query,
			}),
			providesTags: ['donations'],
		}),

		getSupporters: build.query<IShortUserData[], void>({
			query: () => 'supporters',
		}),

		getUsdKoef: build.query<number, string>({
			query: (chainSymbol) => ({ url: `exchange/${chainSymbol}` }),
		}),

		createDonation: build.mutation<IDonation, IFullSendDonat>({
			query: (donationInfo) => ({
				url: '/',
				method: 'POST',
				params: { isVisibleNotification: false },
				body: donationInfo,
			}),
			invalidatesTags: ['donations'],
		}),
	}),
})

export const {
	useGetWidgetDonationsQuery,
	useLazyGetWidgetDonationsQuery,
	useGetDonationsPageQuery,
	useLazyGetDonationsPageQuery,
	useGetSupportersQuery,
	useLazyGetSupportersQuery,
	useCreateDonationMutation,
	useGetUsdKoefQuery,
	useLazyGetUsdKoefQuery,
} = donationsApi

export default donationsApi
