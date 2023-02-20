import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initUser } from "consts";
import userApi from "store/services/UserService";
import { IUser } from "types";

export const userSlice = createSlice({
  name: "user",
  initialState: initUser,
  reducers: {
    setUser(state, { payload }: PayloadAction<IUser>) {
      state = payload;
      return state;
    },
    logoutUser() {
      return initUser;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      userApi.endpoints.getUser.matchFulfilled,
      (state, { payload }: PayloadAction<IUser>) => {
        state = payload;
        return state;
      }
    );
  },
});

export default userSlice.reducer;
