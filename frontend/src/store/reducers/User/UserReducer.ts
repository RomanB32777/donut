import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { initUser } from 'consts'
import { userApi, authApi } from 'store/services'
import { IUser } from 'types'

export const userSlice = createSlice({
	name: 'user',
	initialState: initUser,
	reducers: {
		setUser(state, { payload }: PayloadAction<IUser>) {
			state = payload
			return state
		},
		logoutUser() {
			return initUser
		},
	},
	extraReducers: (builder) => {
		builder.addMatcher(
			userApi.endpoints.getUser.matchFulfilled,
			// : PayloadAction<IUser>
			(state, { payload }) => {
				state = payload
				return state
			}
		)

		builder.addMatcher(authApi.endpoints.login.matchFulfilled, (state, { payload }) => {
			const { access_token, ...userInfo } = payload
			state = userInfo
			return state
		})
	},
})

export default userSlice.reducer
