import { IUser } from "types";

interface IUserAction {
  type: string;
  payload: IUser;
}

export type { IUserAction };
