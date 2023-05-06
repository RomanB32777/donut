import { createApi } from '@reduxjs/toolkit/query/react'
import { FileUploadTypes, IBadgeCreatingInfo, IBagdeAssignInfo, IShortUserData } from 'types'
import { setFormDataValues } from 'utils'
import { baseQuery } from './utils'
import { IBadgePage } from 'appTypes'

interface IBadgeCreate extends IBadgeCreatingInfo {
	[FileUploadTypes.badges]?: File | null
}

const badgesApi = createApi({
	reducerPath: 'badgesApi',
	baseQuery: baseQuery({
		apiURL: 'api/badges',
	}),
	tagTypes: ['badges', 'holders'],
	endpoints: (build) => ({
		getBadges: build.query<IBadgePage[], void>({
			query: () => '/',
			providesTags: ['badges'],
		}),

		getBadge: build.query<IBadgePage, string>({
			query: (id) => `/${id}`,
			providesTags: ['badges'],
		}),

		getHolders: build.query<IShortUserData[], string>({
			query: (id) => `holders/${id}`,
			providesTags: ['badges'],
		}),

		getAssignPrice: build.query<number, IBagdeAssignInfo>({
			query: (queryParams) => ({
				url: 'price/assign',
				params: queryParams,
			}),
		}),

		createBadge: build.mutation<IBadgePage, IBadgeCreate>({
			query: (badgeInfo) => {
				const formData = new FormData()
				setFormDataValues({ formData, dataValues: badgeInfo })
				return {
					url: '/',
					method: 'POST',
					params: { isVisibleNotification: false },
					body: formData,
				}
			},
			invalidatesTags: ['badges'],
		}),

		assignBadge: build.mutation<string, IBagdeAssignInfo & { id: string }>({
			query: ({ id, ...assignInfo }) => ({
				url: `/${id}`,
				method: 'PATCH',
				body: assignInfo,
			}),
			invalidatesTags: ['badges'],
		}),

		deleteBadge: build.mutation<IBadgePage, string>({
			query: (id) => ({
				url: `/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['badges'],
		}),
	}),
})

export const {
	useGetBadgesQuery,
	useLazyGetBadgesQuery,
	useGetBadgeQuery,
	useLazyGetBadgeQuery,
	useGetHoldersQuery,
	useLazyGetHoldersQuery,
	useGetAssignPriceQuery,
	useLazyGetAssignPriceQuery,
	useCreateBadgeMutation,
	useDeleteBadgeMutation,
	useAssignBadgeMutation,
} = badgesApi

export default badgesApi
