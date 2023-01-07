import { typeAligmnet } from "types";
import { IAlert, IBadge, IWidgetGoalData, IWidgetStatData } from "../appTypes";

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

const initWidgetGoalData: IWidgetGoalData = {
  widgetAmount: "0",
  widgetDescription: "",
};

const initWidgetStatData: IWidgetStatData = {
  id: 0,
  title: "",
  stat_description: "",
  template: [],
  data_type: "top-donations", // filterDataTypeItems["top-donations"]
  time_period: "today", // "Today"
  custom_period: "",
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

export {
  alignItemsList,
  alignFlextItemsList,
  initAlertData,
  initWidgetGoalData,
  initWidgetStatData,
  initBadgeData,
};
