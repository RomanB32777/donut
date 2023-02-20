import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import {
  LoadingReducer,
  NotificationsReducer,
  UserReducer,
  WalletReducer,
} from "./reducers";
import {
  userApi,
  notificationsApi,
  donationsApi,
  alertsApi,
  goalsApi,
  statsApi,
  badgesApi,
  filesApi,
} from "./services";
import { rtkQueryErrorLogger } from "./services/utils";

const rootReducer = combineReducers({
  user: UserReducer,
  loading: LoadingReducer,
  notifications: NotificationsReducer,
  blockchain: WalletReducer,

  // RTK
  [userApi.reducerPath]: userApi.reducer,
  [notificationsApi.reducerPath]: notificationsApi.reducer,
  [donationsApi.reducerPath]: donationsApi.reducer,
  [alertsApi.reducerPath]: alertsApi.reducer,
  [goalsApi.reducerPath]: goalsApi.reducer,
  [statsApi.reducerPath]: statsApi.reducer,
  [badgesApi.reducerPath]: badgesApi.reducer,
  [filesApi.reducerPath]: filesApi.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      rtkQueryErrorLogger,
      userApi.middleware,
      notificationsApi.middleware,
      donationsApi.middleware,
      alertsApi.middleware,
      goalsApi.middleware,
      statsApi.middleware,
      badgesApi.middleware,
      filesApi.middleware,
    ]),

  devTools: process.env.NODE_ENV !== "production",
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
