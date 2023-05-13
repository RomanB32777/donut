interface IStaticFile {
	name: string
	path: string
}

enum FileUploadTypes {
	avatar = 'avatar',
	alert = 'alert',
	sound = 'sound',
	background = 'background',
	header = 'header',
	badges = 'badges',
	twitch = 'twitch',
}

type fileUploadTypes = keyof typeof FileUploadTypes

type alertAssetTypes = Extract<fileUploadTypes, 'alert' | 'sound'>
type donatAssetTypes = Extract<fileUploadTypes, 'background' | 'header' | 'twitch'>
type defaultAssetsFolders = alertAssetTypes | donatAssetTypes

export { FileUploadTypes }
export type { IStaticFile, alertAssetTypes, donatAssetTypes, fileUploadTypes, defaultAssetsFolders }
