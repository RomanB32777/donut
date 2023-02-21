interface ISoundInfo {
  name: string;
  link: string;
  isUploaded?: boolean;
}

interface ISendingDataWithFile<DataType = object> {
  data?: DataType;
  username?: string;
  filelink?: string;
  userID?: number;
  isReset?: boolean;
}

// enum userUploadsEnum {
//   avatars,
// }

type alertAssetTypes = "alert" | "sound";
type donatAssetTypes = "background" | "header";

type defaultAssetsFolders = donatAssetTypes | alertAssetTypes;

type fileUploadTypes = defaultAssetsFolders | "avatar" | "badges";

export type {
  ISoundInfo,
  ISendingDataWithFile,
  alertAssetTypes,
  donatAssetTypes,
  fileUploadTypes,
  defaultAssetsFolders,
};
