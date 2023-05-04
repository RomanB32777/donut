import { IStaticFile } from "types";

export interface IDefaultImagesModal {
  images: IStaticFile[];
  isOpen: boolean;
}

export type typesTabContent = "All" | "Settings" | "Preview";

export interface IStringObj {
  [key: string]: string;
}

export enum LOCALES {
  EN = "en-EN",
  PT = "pt-BR", // Brazil
  ES = "es",
  RU = "ru",
  KR = "kr",
  TH = "th",
}

export type LocaleKeyTypes = keyof typeof LOCALES;

export type AuthModalTypes = "registration" | "login";

export interface IAuthTypeModal {
  changeTypeModal: (type: AuthModalTypes) => void;
}

export interface ILandingModal {
  isOpenModal: boolean;
  closeModal: () => void;
}

export interface IError {
  message: string;
  statusCode: number;
}

export interface IsVisibleNotification {
  isVisibleNotification?: boolean;
}
