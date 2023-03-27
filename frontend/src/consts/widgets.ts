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
  id: "",
  banner: {
    preview: "",
    file: null,
  },
  messageColor: "#ffffff",
  messageFont: {
    name: "",
    link: "",
  },
  nameColor: "#ffffff",
  nameFont: {
    name: "",
    link: "",
  },
  sumColor: "#ffffff",
  sumFont: {
    name: "",
    link: "",
  },
  duration: 15,
  sound: {
    name: "",
    path: "",
  },
  voice: false,
  genderVoice: "MALE",
  creator: "",
};

const initWidgetGoalData: IWidgetGoalData = {
  amountGoal: 0,
  id: "",
  title: "",
  amountRaised: 0,
  isArchive: false,
  creator: "",
  titleColor: "",
  titleFont: {
    name: "",
    link: "",
  },
  progressColor: "",
  progressFont: {
    name: "",
    link: "",
  },
  backgroundColor: "",
};

const initWidgetStatData: IWidgetStatData = {
  id: "",
  title: "",
  description: "",
  template: [],
  dataType: "top-donations",
  timePeriod: "today",
  customPeriod: "",
  titleColor: "",
  titleFont: {
    name: "",
    link: "",
  },
  barColor: "",
  contentColor: "",
  contentFont: {
    name: "",
    link: "",
  },
  textAligment: "Left",
  creator: "",
};

export {
  alignItemsList,
  alignFlextItemsList,
  initAlertData,
  initWidgetGoalData,
  initWidgetStatData,
};
