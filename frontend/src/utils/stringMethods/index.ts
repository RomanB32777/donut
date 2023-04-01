import { Buffer } from "buffer";
import { IntlShape } from "react-intl";
import { addNotification } from "../notifications";
import { formatNumber } from "utils/appMethods";
import { IReplaceObj } from "./types";

export const getRandomStr = (length: number) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
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

export const copyStr = ({
  str,
  copyObject = "link",
  intl,
}: {
  str: string;
  copyObject?: string;
  intl: IntlShape;
}) => {
  try {
    navigator.clipboard.writeText(str);
    const formatCopyObject = copyObject[0].toUpperCase() + copyObject.slice(1);
    addNotification({
      type: "success",
      title: intl.formatMessage(
        { id: "copy_message_successfully" },
        { formatCopyObject }
      ),
    });
  } catch (error) {
    addNotification({
      type: "warning",
      title: intl.formatMessage(
        { id: "copy_message_error" },
        { copyObject: copyObject.toLowerCase() }
      ),
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
  objToRender: any // TODO
) => {
  return renderStrWithTokens(template, [
    {
      re: /{username}/gi,
      to: objToRender?.username || objToRender?.backer?.username,
    },
    {
      re: /{sum}/gi,
      to: `${formatNumber(objToRender.sum)} USD`,
    },
    {
      re: /{message}/gi,
      to: objToRender.message || "",
    },
  ]);
};

export const fromHexToString = (strHex: string) => {
  const bufferFormat = Buffer.from(strHex, "hex");
  if (bufferFormat) return bufferFormat.toString("utf8");
  else return strHex;
};
