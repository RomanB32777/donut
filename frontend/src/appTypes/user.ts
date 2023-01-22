import { IDonatPage, IUser } from "types";
import { IFileInfo } from "./files";

interface IUserAction {
  type: string;
  payload: IUser;
}

interface IDonatPageWithFiles extends IDonatPage<IFileInfo> {}

interface IUserWithFiles extends IUser<IFileInfo>{}


export type { IUserAction, IDonatPageWithFiles, IUserWithFiles };
