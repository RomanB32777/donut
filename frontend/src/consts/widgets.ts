import { typeAligmnet } from "types";
import { IAlert, IBadge } from "../types";

const alignItemsList: { [key in typeAligmnet]: string } = {
  Left: "start",
  Center: "center",
  Right: "end",
};

const alignFlextItemsList: { [key in typeAligmnet]: string } = {
  Left: "flex-start",
  Center: "center",
  Right: "flex-end",
};

const initAlertData: IAlert = {
  banner: {
    preview: "",
    file: null,
  },
  message_color: "#ffffff",
  message_font: {
    name: "",
    link: "",
  },
  name_color: "#ffffff",
  name_font: {
    name: "",
    link: "",
  },
  sum_color: "#ffffff",
  sum_font: {
    name: "",
    link: "",
  },
  duration: 15,
  sound: "",
  voice: false,
  gender_voice: "MAN",
};

const initBadgeData: IBadge = {
  id: 0,
  creator_id: 0,
  image: {
    preview: "",
    file: null,
  },
  title: "",
  description: "",
  blockchain: "",
  URI: "",
  contract_address: "",
  transaction_hash: "",
  result: "pending",
  quantity: 0,
};

export { alignItemsList, alignFlextItemsList, initAlertData, initBadgeData };
