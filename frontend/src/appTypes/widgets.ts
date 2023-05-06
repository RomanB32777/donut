import { IAlertData, IGoalData, IStatData, IStaticFile } from 'types'
import { IFileInfo } from './files'

export type AlignText = 'left' | 'center' | 'right'

export interface IFont {
	name: string
	link: string
}

// goals
export type IWidgetGoalData = IGoalData<IFont>

// // stats
export type IWidgetStatData = IStatData<IFont>

// alert
export type IAlert = IAlertData<IFont, IFileInfo, IStaticFile>
