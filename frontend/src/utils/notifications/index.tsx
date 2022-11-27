import { Store } from "react-notifications-component";
import { baseURL, isProduction } from "../../axiosClient";
import {
  INotification,
  INotificationWithoutType,
  typeNotification,
} from "./types";

export const addNotification = ({ type, title, message }: INotification) => {
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

export const addAuthNotification = () =>
  addNotification({
    title: "Authorization",
    message: "To perform this action, please register",
    type: "info",
  });

export const addAuthWalletNotification = (wallet: string) =>
  addNotification({
    title: "Authorization",
    message: `You need to log in to your wallet ${wallet}`,
    type: "warning",
  });

export const addErrorNotification = ({
  message,
  title,
}: INotificationWithoutType) =>
  addNotification({
    title: title || "Error",
    message,
    type: "danger",
  });

export const addSuccessNotification = ({
  message,
  title,
}: INotificationWithoutType) =>
  addNotification({
    title: title || "Success",
    message,
    type: "success",
  });

export const addNotFoundUserNotification = () =>
  addNotification({
    type: "danger",
    title: "User with this username not found!",
  });

export const addInstallWalletNotification = (
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

export const getNotificationMessage = ({
  type,
  user,
  data,
}: {
  type: typeNotification;
  user?: any;
  data?: any;
}) => {
  switch (type) {
    case "donat_creator":
      return `${user} sent you ${data.sum} ${data.blockchain}!`;

    case "donat_supporter":
      return `You sent ${data.sum} ${data.blockchain} to ${user}!`;

    case "add_badge_creator":
      return (
        <span>
          You sent{" "}
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
          )}{" "}
          to {user}
        </span>
      );

    case "add_badge_supporter":
      return (
        <span>
          You received{" "}
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
          )}{" "}
          from {user};
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
          </a>{" "}
          to check!
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
          </a>{" "}
          was created successfully!
        </span>
      );

    default:
      return `notification`;
  }
};
