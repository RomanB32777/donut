interface IHelpContent<StepsType = string> {
	text: string
	image?: string
	steps?: StepsType[]
}

interface IHelpTheme<ContentType = string> {
	label: string
	content?: ContentType[]
	children?: IHelpTheme<ContentType>[]
}

type themesType = IHelpTheme<IHelpContent<IHelpContent | string> | string>

export type { IHelpContent, IHelpTheme, themesType }
