import { IResetField } from './src/general'
import {
	periodItemsTypes,
	IFilterPeriodItems,
	PeriodItemsAll,
	allPeriodItemsTypes,
	ICurrentPeriodItemsTypes,
} from './src/dates'
import {
	IStaticFile,
	alertAssetTypes,
	donatAssetTypes,
	fileUploadTypes,
	defaultAssetsFolders,
} from './src/files'
import {
	UserRoles,
	Genders,
	BannerTypes,
	UserStatus,
	userStatus,
	userRoles,
	gendersType,
	bannerTypes,
	IUserBase,
	IDonatPageWithoutBanners,
	IEditUserData,
	IShortUserData,
	IDonatPage,
	ICreatorInfo,
	IUser,
	IRegisterUser,
	ILoginUser,
	IUserTokenPayload,
	IEditCreator,
	userDataKeys,
	creatorDataKeys,
} from './src/user'
import {
	ExchangeNames,
	BlockchainsSymbols,
	blockchainNames,
	blockchainNetworks,
	blockchainsType,
	blockchainsSymbols,
} from './src/wallet'
import {
	IDonationShortInfo,
	IDonation,
	socketNotificationTypes,
	ISocketNotification,
	ISendDonat,
	IFullSendDonat,
	IDonationsQueryData,
	donationsQueryData,
	sendDonatFieldsKeys,
} from './src/donations'
import {
	badgeStatus,
	IBadgeBase,
	IBadgeInfo,
	IBadgeCreatingInfo,
	IBagdeAssignInfo,
} from './src/badge'
import {
	IWidgetQueryData,
	IGoalDataBase,
	IGoalWidgetData,
	IGoalData,
	IEditGoalData,
	goalDataKeys,
	IAlertData,
	IGenerateSoundQuery,
	IEditAlertData,
	TextAlignment,
	typeAlignment,
	StatsDataTypes,
	statsDataTypes,
	IStatDataBase,
	IStatWidgetData,
	IStatData,
	IEditStatData,
	statsDataKeys,
} from './src/widgets'
import {
	NotificationRoles,
	notificationRoles,
	ISocketEmitObj,
	notificationKeys,
	INotification,
	INotificationQueries,
} from './src/notifications'
import { FileUploadTypes } from './src/files'

export {
	// dates
	PeriodItemsAll,

	// user
	UserRoles,
	Genders,
	BannerTypes,
	UserStatus,

	// notifications
	NotificationRoles,

	// widgets
	TextAlignment,
	StatsDataTypes,

	// wallet
	ExchangeNames,
	BlockchainsSymbols,

	// files
	FileUploadTypes,
}

export type {
	//general
	IResetField,

	// dates
	periodItemsTypes,
	IFilterPeriodItems,
	allPeriodItemsTypes,
	ICurrentPeriodItemsTypes,

	// files
	IStaticFile,
	alertAssetTypes,
	donatAssetTypes,
	fileUploadTypes,
	defaultAssetsFolders,

	// user
	userRoles,
	gendersType,
	bannerTypes,
	userStatus,
	IUserBase,
	IDonatPageWithoutBanners,
	IEditUserData,
	IShortUserData,
	IDonatPage,
	ICreatorInfo,
	IUser,
	IRegisterUser,
	ILoginUser,
	IUserTokenPayload,
	IEditCreator,
	userDataKeys,
	creatorDataKeys,

	// wallet
	blockchainNames,
	blockchainNetworks,
	blockchainsType,
	blockchainsSymbols,

	// donate
	IDonationShortInfo,
	IDonation,
	socketNotificationTypes,
	ISocketNotification,
	ISendDonat,
	IFullSendDonat,
	IDonationsQueryData,
	donationsQueryData,
	sendDonatFieldsKeys,

	// badge
	badgeStatus,
	IBadgeBase,
	IBadgeInfo,
	IBadgeCreatingInfo,
	IBagdeAssignInfo,

	// widgets
	IWidgetQueryData,
	IGoalDataBase,
	IGoalWidgetData,
	IGoalData,
	IEditGoalData,
	goalDataKeys,
	IAlertData,
	IGenerateSoundQuery,
	IEditAlertData,
	typeAlignment,
	statsDataTypes,
	IStatDataBase,
	IStatWidgetData,
	IStatData,
	IEditStatData,
	statsDataKeys,

	// notifications
	notificationRoles,
	ISocketEmitObj,
	notificationKeys,
	INotification,
	INotificationQueries,
}
// declare module "types" {}
