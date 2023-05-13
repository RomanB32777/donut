import { IDonatPage, IUser, IUserTokenPayload } from 'types'
import { IFileInfo } from './files'

export type IDonatPageWithFiles = IDonatPage<IFileInfo>

export type DonatePageFields = keyof IDonatPageWithFiles

export type IUserWithFiles = IUser<IFileInfo>

export interface IAuthToken {
	access_token: string
}

export interface IWebToken {
	web_token: string
}

export interface IUserWithToken extends IUserTokenPayload, IAuthToken {}

export interface IFullUserWithToken extends IUser, IAuthToken {}
