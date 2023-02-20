import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { INotification } from "types";
import notificationsApi from "store/services/NotificationsService";
import { INotificationsState } from "appTypes/notifications";

const initialState: INotificationsState = {
  list: [],
  shouldUpdateApp: true,
};

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState: initialState,
  reducers: {
    setNotifications(state, { payload }: PayloadAction<INotificationsState>) {
      const { list, shouldUpdateApp } = payload;
      state.list = list;
      state.shouldUpdateApp = shouldUpdateApp;
    },

    addNotifications(state, { payload }: PayloadAction<INotificationsState>) {
      const { list, shouldUpdateApp } = payload;
      state.list = list.concat(state.list);
      state.shouldUpdateApp = shouldUpdateApp;
    },

    setUpdatedFlag(
      state,
      { payload: shouldUpdateApp }: PayloadAction<boolean>
    ) {
      state.shouldUpdateApp = shouldUpdateApp;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      notificationsApi.endpoints.getNotifications.matchFulfilled,
      (state, { payload }: PayloadAction<INotification[]>) => {
        state.list = payload;
      }
    );
  },
});

export default notificationsSlice.reducer;
