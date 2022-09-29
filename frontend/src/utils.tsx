import {
  NotificationTitleMessage,
  NOTIFICATION_TYPE,
  Store,
} from "react-notifications-component";
import moment from "moment";
import postData from "./functions/postData";
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

export const addNotFoundUserNotification = () =>
  addNotification({
    type: "danger",
    title: "User with this username not found!",
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

declare type typeNotification =
  | "donat_creator"
  | "donat_supporter"
  | "following_creator"
  | "following_backer"
  | "add_badge_creator"
  | "add_badge_supporter"
  | "remove_badge_creator"
  | "remove_badge_supporter";

export const getNotificationMessage = (
  type: typeNotification,
  user: any,
  data?: any
) => {
  switch (type) {
    case "donat_creator":
      return `${user} sent you ${
        data.additional ? data.additional.sum : data.sum
      } ${'tEVMOS'}!`;

    case "donat_supporter":
      return `You sent ${data.additional ? data.additional.sum : data.sum} ${'tEVMOS'} to ${user}!`;

    case "following_creator":
      return `${user} started following you`;

    case "following_backer":
      return `You started following ${user}`;

    case "add_badge_creator":
      return `You sent a badge ${data || ""} to ${user}`;

    case "add_badge_supporter":
      return `You received a badge ${data || ""} from ${user}`;

    default:
      return `notification`;
  }
};

export const DateTimezoneFormatter = (date: string) => {
  const initDate = new Date(date);
  const formatedDate = initDate.getTime();
  const userOffset = initDate.getTimezoneOffset() * 60 * 1000;
  return new Date(formatedDate + userOffset).toISOString();
};

export const DateFormatter = (
  date: string,
  toFormat: string = "DD/MM/YYYY HH:mm"
) => {
  let dateFormat = moment(date).format(toFormat);
  if (dateFormat === "Invalid Date") dateFormat = "";
  return dateFormat;
};

export const checkIsExistUser = async (token: string) => {
  const data = await postData("/api/user/check-user-exist/", { token });
  console.log(data);

  if (data.notExist) return false;
  return true;
};

export const checkNotifPermissions = () => {
  var status = false;
  if ("Notification" in window) {
    if (localStorage.getItem("permissionsNotif")) {
      if (localStorage.getItem("permissionsNotif") === "true") status = true;
    } else if (Notification.permission === "granted") status = true;
    else
      Notification.requestPermission((permission) => {
        if (permission === "granted") {
          status = true;
        } else {
          status = false;
        }
      });
  }
  return status;
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

export const sendFile = async (file: File, user: any, url: string) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", file.name);
  if (user && user.id) {
    const res = await axiosClient.post(url + user.id, formData);
    if (res.status === 200) {
      return res;
    }
  }
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

declare type currencyTypes = "evmos";

export const getUsdKoef = async (
  currency: currencyTypes,
  setUsdtKoef?: (price: number) => void
) => {
  const { data } = await axiosClient.get(
    `https://api.coingecko.com/api/v3/simple/price?ids=${currency}&vs_currencies=usd`
  );
  setUsdtKoef && setUsdtKoef(+data[currency].usd);
  return +data[currency].usd;
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

export const renderStatItem = (
  template: string | string[],
  objToRender: any,
  usdtKoef: number
) => {
  return renderStrWithTokens(template, [
    {
      re: /{username}/gi,
      to: objToRender.username,
    },
    {
      re: /{sum}/gi,
      to: `${(+objToRender.sum_donation * usdtKoef).toFixed(2)} USD`,
    },
    {
      re: /{message}/gi,
      to: objToRender.donation_message || "",
    },
  ]);
};

// return renderStrWithTokens(template, objToRender, ["username", "sum", "message"]);
// export const renderStrWithTokens = (
//   template: string | string[],
//   objToRender: any,
//   fields: string[]
// ) => {
//   const str = Array.isArray(template) ? template.join(" ") : template;
//   return fields.reduce((acc, field) => {
//     const expStr = `{${field}}`;
//     return acc.replace(new RegExp(expStr, "gi"), objToRender[field]);
//   }, str);
// };
