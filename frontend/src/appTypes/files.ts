import { ISendingDataWithFile } from "types";

interface IFileInfo {
  preview: string;
  file: File | null;
}

interface IDataWithFile<DataType = object> extends ISendingDataWithFile<DataType> {
  file: File | null;
}

export type { IFileInfo, IDataWithFile };
