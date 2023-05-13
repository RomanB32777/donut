import { IShortUserData, IUser } from 'types'
import { IAuthToken, IWebToken, IDonatPageWithFiles, IFileInfo, IUserWithFiles } from 'appTypes'

export const initFileInfo: IFileInfo = {
	preview: '',
	file: null,
}

export const initUser: IUser = {
	id: '',
	username: '',
	roleplay: 'creators',
	walletAddress: '',
	avatarLink: '',
	createdAt: new Date(),
	email: '',
	status: 'confirmation',
}

export const initDonatPage: IDonatPageWithFiles = {
	headerBanner: initFileInfo,
	backgroundBanner: initFileInfo,
	twitchBanner: initFileInfo,
	welcomeText: '',
	btnText: '',
	mainColor: '',
	backgroundColor: '',
}

export const initUserWithFiles: IUserWithFiles = {
	id: '',
	username: '',
	roleplay: 'creators',
	walletAddress: '',
	avatarLink: initFileInfo,
	createdAt: new Date(),
	email: '',
	status: 'confirmation',
}

export const shortUserInfo: IShortUserData = {
	id: '',
	username: '',
	walletAddress: '',
	roleplay: 'backers',
}

export const initAuthToken: IAuthToken = {
	access_token: '',
}

export const initWebToken: IWebToken = {
	web_token: '',
}
