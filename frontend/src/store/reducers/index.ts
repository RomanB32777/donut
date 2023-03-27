import UserReducer, { userSlice } from "./User/UserReducer";
import LoadingReducer, { loadingSlice } from "./Loading/LoadingReducer";
import NotificationsReducer, {
  notificationsSlice,
} from "./Notifications/NotificationsReducer";

const actions = {
  ...userSlice.actions,
  ...notificationsSlice.actions,
  ...loadingSlice.actions,
};

export { actions, UserReducer, LoadingReducer, NotificationsReducer };
