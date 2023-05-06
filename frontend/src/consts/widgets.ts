import { typeAlignment } from 'types'
import { IAlert, IWidgetGoalData, IWidgetStatData } from 'appTypes'

export const maxSoundDuration = 5 // s

export const alignItemsList: { [key in typeAlignment]: string } = {
	Left: 'start',
	Center: 'center',
	Right: 'end',
}

export const alignFlexItemsList: { [key in typeAlignment]: string } = {
	Left: 'flex-start',
	Center: 'center',
	Right: 'flex-end',
}

export const initAlertData: IAlert = {
	id: '',
	banner: {
		preview: '',
		file: null,
	},
	messageColor: '#ffffff',
	messageFont: {
		name: '',
		link: '',
	},
	nameColor: '#ffffff',
	nameFont: {
		name: '',
		link: '',
	},
	sumColor: '#ffffff',
	sumFont: {
		name: '',
		link: '',
	},
	duration: 15,
	sound: {
		name: '',
		path: '',
	},
	voice: false,
	genderVoice: 'MALE',
	creator: '',
}

export const initWidgetGoalData: IWidgetGoalData = {
	amountGoal: 0,
	id: '',
	title: '',
	amountRaised: 0,
	isArchive: false,
	creator: '',
	titleColor: '',
	titleFont: {
		name: '',
		link: '',
	},
	progressColor: '',
	progressFont: {
		name: '',
		link: '',
	},
	backgroundColor: '',
}

export const initWidgetStatData: IWidgetStatData = {
	id: '',
	title: '',
	description: '',
	template: [],
	dataType: 'top-donations',
	timePeriod: 'today',
	customTimePeriod: '',
	titleColor: '',
	titleFont: {
		name: '',
		link: '',
	},
	barColor: '',
	contentColor: '',
	contentFont: {
		name: '',
		link: '',
	},
	textAlignment: 'Left',
	creator: '',
}
