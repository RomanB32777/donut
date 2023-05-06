type IFilterPeriodItems<T = string> = {
	[key in periodItemsTypes]: T
}

enum PeriodItemsAll {
	today = 'today',
	'7days' = '7days',
	'30days' = '30days',
	year = 'year',
	yesterday = 'yesterday',
	all = 'all',
	custom = 'custom',
}

type allPeriodItemsTypes = keyof typeof PeriodItemsAll // periodItemsTypes | currentPeriodItemsTypes;

type periodItemsTypes = Exclude<allPeriodItemsTypes, 'yesterday' | 'all' | 'custom'>

type ICurrentPeriodItemsTypes<T> = {
	[key in allPeriodItemsTypes]: T
}

export { PeriodItemsAll }

export type { periodItemsTypes, allPeriodItemsTypes, IFilterPeriodItems, ICurrentPeriodItemsTypes }
