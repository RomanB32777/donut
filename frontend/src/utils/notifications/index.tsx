import { Store } from "react-notifications-component";
import { IDonationShortInfo } from "types";
import { baseURL, isProduction } from "consts";
import {
  INotification,
  INotificationMessage,
  INotificationWithoutType,
} from "./types";
import { formatNumber } from "utils/appMethods";

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

const getNotificationMessage: <T extends object = IDonationShortInfo>(
  arg: INotificationMessage
) => React.ReactNode = (args) => {
  const { type, user, data } = args;
  if (data) {
    switch (type) {
      case "donat_creator":
        const { sum_donation, blockchain } = data;
        return `${user} sent you ${formatNumber(sum_donation)} ${blockchain}!`;

      case "donat_supporter":
        const { sum_donation: supporterSum, blockchain: supporterBlockchain } =
          data;
        return `You sent ${formatNumber(supporterSum)} ${supporterBlockchain} to ${user}!`;

      case "add_badge_creator":
        return (
          <span>
            You sent&nbsp;
            {data ? (
              <a
                href={`${baseURL}/badges?id=${data}`}
                target="_blank"
                rel="noreferrer"
                style={{ color: "#fff", textDecoration: "underline" }}
              >
                a badge
              </a>
            ) : (
              "a badge"
            )}
            &nbsp; to {user}
          </span>
        );

      case "add_badge_supporter":
        return (
          <span>
            You received&nbsp;
            {data ? (
              <a
                href={`${baseURL}/badges?id=${data}`}
                target="_blank"
                rel="noreferrer"
                style={{ color: "#fff", textDecoration: "underline" }}
              >
                a badge
              </a>
            ) : (
              "a badge"
            )}
            &nbsp; from {user};
          </span>
        );

      case "failed_badge":
        return (
          <span>
            Error occurred while creating your badge.
            <a
              href={`https://${
                isProduction ? "" : "nile."
              }tronscan.org/#/transaction/${data}`}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#fff", textDecoration: "underline" }}
            >
              Click here
            </a>
            &nbsp; to check!
          </span>
        );

      case "success_badge":
        return (
          <span>
            <a
              href={`${baseURL}/badges?id=${data}`}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#fff", textDecoration: "underline" }}
            >
              New badge
            </a>
            &nbsp; was created successfully!
          </span>
        );

      default:
        return `notification`;
    }
  }
  return "";
};

export {
  addNotification,
  addAuthNotification,
  addAuthWalletNotification,
  addErrorNotification,
  addSuccessNotification,
  addNotFoundUserNotification,
  addInstallWalletNotification,
  getNotificationMessage,
};
