interface ISoundInfo {
  name: string;
  link: string;
}

enum defaultImageNameEnum {
  backgrounds = "backgrounds",
  headers = "headers",
  alerts = "alerts",
}

enum userUploadsEnum {
  avatars = "avatars",
  sounds = "sounds",
}

type fileUploadTypes =
  | keyof typeof defaultImageNameEnum
  | keyof typeof userUploadsEnum;

type defaultImageNameFolders = keyof typeof defaultImageNameEnum;

export type { ISoundInfo, fileUploadTypes, defaultImageNameFolders };
