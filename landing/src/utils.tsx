import {
  NotificationTitleMessage,
  NOTIFICATION_TYPE,
  Store,
} from "react-notifications-component";
// import postData from "./functions/postData";
import axiosClient from "./axiosClient";

interface INotification {
  type: NOTIFICATION_TYPE;
  title: string;
  message?: NotificationTitleMessage;
}

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

export const addSuccessNotification = (message: string) =>
  addNotification({
    title: "Success",
    message,
    type: "success",
  });

export const addInstallWalletNotification = (
  walletName: string,
  installUrl: string
) => {
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

export const checkIsExistUser = async (token: string) => {
  const {data} = await axiosClient.post("/api/user/check-user-exist/", { token });
  console.log(data);

  if (data.notExist) return false;
  return true;
};

export const getRandomStr = (length: number) => {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const shortStr = (str: string, length: number) => {
  return str.length > 30
    ? str.slice(0, 6) + "..." + str.slice(str.length - length)
    : str;
};

export const copyStr = (str: string) => {
  try {
    navigator.clipboard.writeText(str);
    addNotification({
      type: "success",
      title: "Link successfully copied",
    });
  } catch (error) {
    addNotification({
      type: "warning",
      title: "An error occurred while copying the link",
    });
  }
};

interface IReplaceObj {
  re: RegExp;
  to: string;
}

export const renderStrWithTokens = (
  template: string | string[],
  replaceObj: IReplaceObj[]
) => {
  const str = Array.isArray(template) ? template.join(" ") : template;
  return replaceObj.reduce((acc, { re, to }) => {
    return acc.replace(re, to);
  }, str);
};
