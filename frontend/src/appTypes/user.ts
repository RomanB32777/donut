import { IDonatPage, IUser } from "types";
import { IFileInfo } from "./files";

interface IDonatPageWithFiles extends IDonatPage<IFileInfo> {}

interface IUserWithFiles extends IUser<IFileInfo>{}

export type { IDonatPageWithFiles, IUserWithFiles };
