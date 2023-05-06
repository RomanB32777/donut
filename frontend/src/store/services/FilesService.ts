import { createApi } from '@reduxjs/toolkit/query/react'
import { defaultAssetsFolders, IStaticFile } from 'types'
import { baseQuery } from './utils'

const filesApi = createApi({
	reducerPath: 'filesApi',
	baseQuery: baseQuery({
		apiURL: 'api/files',
	}),
	endpoints: (build) => ({
		getDefaultImages: build.query<IStaticFile[], defaultAssetsFolders>({
			query: (type) => `/default-images/${type}`,
		}),

		getSounds: build.query<IStaticFile[], void>({
			query: () => '/sounds',
		}),
	}),
})

export const {
	useGetDefaultImagesQuery,
	useLazyGetDefaultImagesQuery,
	useGetSoundsQuery,
	useLazyGetSoundsQuery,
} = filesApi

export default filesApi
