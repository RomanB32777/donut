import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const loadingSlice = createSlice({
	name: 'loading',
	initialState: true,
	reducers: {
		setLoading(state, { payload }: PayloadAction<boolean>) {
			state = payload
			return state
		},
	},
})

export default loadingSlice.reducer
