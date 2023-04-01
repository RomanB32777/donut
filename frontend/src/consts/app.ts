import { LOCALES } from "appTypes";
import dummyImg from "assets/big_don.png";
import gbFlag from "assets/locales/GB.png";
import esFlag from "assets/locales/ES.png";
import krFlag from "assets/locales/KR.png";
import ptFlag from "assets/locales/PT.png";
import ruFlag from "assets/locales/RU.png";
import thFlag from "assets/locales/TH.png";

export { dummyImg };

export const RoutePaths = {
  main: "/",
  admin: "admin",
  dashboard: "dashboard",
  donat: "donat",
  widgets: "widgets",
  alerts: "alerts",
  stats: "stats",
  goals: "goals",
  donations: "donations",
  badges: "badges",
  settings: "settings",
  support: "support",
  donatMessage: "donat-message",
  donatGoal: "donat-goal",
  donatStat: "donat-stat",
  reset: "reset", // form with email
  change: "change", // form with new password
  resend: "resend", // resend confirm mail
};

export const dashboardPath = `/${RoutePaths.admin}/${RoutePaths.dashboard}`;

export const isProduction = process.env.REACT_APP_NODE_ENV === "production";

export const baseURL =
  `${isProduction ? "https" : "http"}://${window.location.hostname}` +
  (!isProduction ? `:${process.env.REACT_APP_BACKEND_PORT || 4000}` : "");

export const localesStorageKey = "locale";

export const localeFlags: Record<LOCALES, string> = {
  [LOCALES.EN]: gbFlag,
  [LOCALES.PT]: ptFlag,
  [LOCALES.ES]: esFlag,
  [LOCALES.RU]: ruFlag,
  [LOCALES.KR]: krFlag,
  [LOCALES.TH]: thFlag,
};

export const dayLocales: Record<LOCALES, () => any> = {
  [LOCALES.RU]: () => import("dayjs/locale/ru"),
  [LOCALES.EN]: () => import("dayjs/locale/en"),
  [LOCALES.PT]: () => import("dayjs/locale/pt"),
  [LOCALES.ES]: () => import("dayjs/locale/es"),
  [LOCALES.KR]: () => import("dayjs/locale/en"),
  [LOCALES.TH]: () => import("dayjs/locale/th"),
};

export const antdLocales: Record<LOCALES, () => any> = {
  [LOCALES.RU]: () => import("antd/es/date-picker/locale/ru_RU"),
  [LOCALES.EN]: () => import("antd/es/date-picker/locale/en_GB"),
  [LOCALES.PT]: () => import("antd/es/date-picker/locale/pt_PT"),
  [LOCALES.ES]: () => import("antd/es/date-picker/locale/es_ES"),
  [LOCALES.KR]: () => import("antd/es/date-picker/locale/ko_KR"),
  [LOCALES.TH]: () => import("antd/es/date-picker/locale/th_TH"),
};

export const notVisibleFontsCount = 1;

export const delayNotVisibleBanner = 5000;
