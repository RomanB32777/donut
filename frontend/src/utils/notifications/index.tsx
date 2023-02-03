import { Store } from "react-notifications-component";
import { Link } from "react-router-dom";
import { IBadgeBase, IDonationShortInfo } from "types";
import {
  INotification,
  INotificationMessage,
  INotificationWithoutType,
} from "./types";
import { formatNumber } from "utils/appMethods";
import { RoutePaths } from "routes";

const addNotification = ({ type, title, message }: INotification) => {
  Store.addNotification({
    title,
    message: message || "",
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
  });

const addErrorNotification = ({ message, title }: INotificationWithoutType) =>
  addNotification({
    title: title || "Error",
    message,
    type: "danger",
  });

const addSuccessNotification = ({ message, title }: INotificationWithoutType) =>
  addNotification({
    title: title || "Success",
    message,
    type: "success",
  });

const addNotFoundUserNotification = (
  title: string = "User with this username not found!"
) =>
  addNotification({
    type: "danger",
    title,
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

// interface INotificationDataBase {
//   id: number;
// }

// const mapNotificationData = <T extends INotificationDataBase>(arg: T) => ({
//   ...arg,
// });

// const { sum_donation, blockchain } = mapNotificationData({
//   ...data,
// });

const getDonatNotificationMessage = (
  args: INotificationMessage<IDonationShortInfo>
): React.ReactNode => {
  const { type, user, data } = args;
  const { sum_donation, blockchain } = data;
  switch (type) {
    case "donat_creator":
      return `${user} sent you ${formatNumber(sum_donation)} ${blockchain}!`;

    case "donat_supporter":
      const { sum_donation: supporterSum, blockchain: supporterBlockchain } =
        args.data;
      return `You sent ${formatNumber(
        supporterSum
      )} ${supporterBlockchain} to ${user}!`;

    default:
      return `notification`;
  }
};

const getBadgeNotificationMessage = (
  args: INotificationMessage<IBadgeBase>
): React.ReactNode => {
  const { type, user, data } = args;
  const { id, title } = data;

  switch (type) {
    case "add_badge_creator":
      return (
        <span>
          You sent&nbsp;
          <Link
            to={`/${RoutePaths.admin}/${RoutePaths.badges}?id=${id}`}
            style={{ color: "#fff", textDecoration: "underline" }}
          >
            {title}
          </Link>
          &nbsp;to {user}
        </span>
      );

    case "add_badge_supporter":
      return (
        <span>
          You received&nbsp;
          <Link
            to={`/${RoutePaths.admin}/${RoutePaths.badges}?id=${id}`}
            style={{ color: "#fff", textDecoration: "underline" }}
          >
            {title}
          </Link>
          &nbsp;from {user}
        </span>
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
