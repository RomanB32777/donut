import { Store } from "react-notifications-component";
import { Link } from "react-router-dom";
import { IntlShape } from "react-intl";
import { IBadgeBase, IDonationShortInfo } from "types";
import {
  INotification,
  INotificationMessage,
  INotificationWithoutType,
} from "./types";
import { formatNumber } from "utils/appMethods";
import { RoutePaths } from "consts";

const addNotification = ({ type, title, message, id }: INotification) => {
  Store.addNotification({
    title,
    message: message || "",
    id,
    type,
    insert: "top",
    container: "top-right",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {
      duration: 5000,
      onScreen: true,
    },
  });
};

const addAuthNotification = () =>
  addNotification({
    title: "Authorization",
    message: "To perform this action, please register",
    type: "info",
  });

const addAuthWalletNotification = () =>
  addNotification({
    title: "Authorization",
    message: `You need to log in to your wallet`,
    type: "warning",
    id: "authorization",
  });

const addErrorNotification = ({ message, title }: INotificationWithoutType) =>
  addNotification({
    title: title || "Error",
    message,
    type: "danger",
  });

const addSuccessNotification = ({
  message,
  title,
  id,
}: INotificationWithoutType) =>
  addNotification({
    title: title || "Success",
    message,
    type: "success",
    id: id || "success",
  });

const addNotFoundUserNotification = (
  title: string = "User with this username not found!"
) =>
  addNotification({
    type: "danger",
    title,
    id: "notFound",
  });

const addInstallWalletNotification = (
  walletName: string,
  installUrl: string
) => {
  const withoutNotificationPages = window.location.pathname.includes("donat-"); // don't show notifications on widget pages
  !withoutNotificationPages &&
    addNotification({
      type: "warning",
      title: `You don't have the ${walletName} wallet extension installed`,
      message: (
        <a
          href={installUrl}
          target="_blank"
          className="auth-modal__link"
          rel="noreferrer"
          style={{
            color: "#fff",
            textDecoration: "underline",
          }}
        >
          Install {walletName}
        </a>
      ),
    });
};

const getDonatNotificationMessage = (
  args: INotificationMessage<IDonationShortInfo>,
  intl: IntlShape
): React.ReactNode => {
  const { type, user, data } = args;
  const { sum, blockchain } = data;
  switch (type) {
    case "donat_creator":
      return intl.formatMessage(
        { id: "notifications_donat_creator" },
        { user, sum: formatNumber(sum), blockchain }
      );

    case "donat_supporter":
      const { sum: supporterSum, blockchain: supporterBlockchain } = args.data;
      return intl.formatMessage(
        { id: "notifications_donat_supporter" },
        {
          user,
          sum: formatNumber(supporterSum),
          blockchain: supporterBlockchain,
        }
      );

    default:
      return `notification`;
  }
};

const getBadgeNotificationMessage = (
  args: INotificationMessage<IBadgeBase>,
  intl: IntlShape
): React.ReactNode => {
  const { type, user, data } = args;
  const { id, title } = data;

  switch (type) {
    case "add_badge_creator":
      return intl.formatMessage(
        { id: "notifications_add_badge_creator" },
        {
          user,
          title: (
            <Link
              to={`/${RoutePaths.admin}/${RoutePaths.badges}?id=${id}`}
              style={{ color: "#fff", textDecoration: "underline" }}
            >
              {title}
            </Link>
          ),
        }
      );

    case "add_badge_supporter":
      return intl.formatMessage(
        { id: "notifications_add_badge_supporter" },
        {
          user,
          title: (
            <Link
              to={`/${RoutePaths.admin}/${RoutePaths.badges}?id=${id}`}
              style={{ color: "#fff", textDecoration: "underline" }}
            >
              {title}
            </Link>
          ),
        }
      );

    default:
      return `notification`;
  }
};

export {
  addNotification,
  addAuthNotification,
  addAuthWalletNotification,
  addErrorNotification,
  addSuccessNotification,
  addNotFoundUserNotification,
  addInstallWalletNotification,
  getDonatNotificationMessage,
  getBadgeNotificationMessage,
};
