import UserReducer, { userSlice } from "./User/UserReducer";
import LoadingReducer, { loadingSlice } from "./Loading/LoadingReducer";
import NotificationsReducer, {
  notificationsSlice,
} from "./Notifications/NotificationsReducer";
import WalletReducer, { walletSlice } from "./Wallet/WalletReducer";

const actions = {
  ...userSlice.actions,
  ...walletSlice.actions,
  ...notificationsSlice.actions,
  ...loadingSlice.actions,
};

export {
  actions,
  UserReducer,
  LoadingReducer,
  NotificationsReducer,
  WalletReducer,
};
