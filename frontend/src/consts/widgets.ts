import { typeAligmnet } from "types";
import { IAlert, IWidgetGoalData, IWidgetStatData } from "appTypes";

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
  amount_goal: 0,
  id: "",
  title: "",
  amount_raised: 0,
  is_archive: false,
  creator_id: "",
  title_color: "",
  title_font: {
    name: "",
    link: "",
  },
  progress_color: "",
  progress_font: {
    name: "",
    link: "",
  },
  background_color: "",
};

const initWidgetStatData: IWidgetStatData = {
  id: "",
  title: "",
  stat_description: "",
  template: [],
  data_type: "top-donations",
  time_period: "today",
  custom_period: "",
  title_color: "",
  title_font: {
    name: "",
    link: "",
  },
  bar_color: "",
  content_color: "",
  content_font: {
    name: "",
    link: "",
  },
  aligment: "Left",
};

export {
  alignItemsList,
  alignFlextItemsList,
  initAlertData,
  initWidgetGoalData,
  initWidgetStatData,
};
