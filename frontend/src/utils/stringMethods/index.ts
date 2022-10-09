import { IReplaceObj } from "./types";
import { addNotification } from "../notifications";

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