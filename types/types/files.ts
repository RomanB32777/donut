interface ISoundInfo {
  name: string;
  link: string;
  isUploaded?: boolean;
}

// enum userUploadsEnum {
//   avatars,
// }

type alertAssetTypes = "alert" | "sound";
type donatAssetTypes = "background" | "header";

type defaultAssetsFolders = donatAssetTypes | alertAssetTypes;

type fileUploadTypes = defaultAssetsFolders | "avatars";

export type {
  ISoundInfo,
  alertAssetTypes,
  donatAssetTypes,
  fileUploadTypes,
  defaultAssetsFolders,
};
