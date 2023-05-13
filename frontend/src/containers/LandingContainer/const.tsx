import {
	ChatIcon,
	ClockIcon,
	CodeIcon,
	CrossIcon,
	DashboardLandingIcon,
	DiscordIcon,
	GraphIcon,
	HelpIcon,
	LinkIcon,
	PencilLandingIcon,
	ShieldLandingIcon,
	TelegramIcon,
	TwitterIcon,
} from 'icons'

import rocketImg from 'assets/landing/rocket.png'
import listImg from 'assets/landing/list.png'
import moneyImg from 'assets/landing/money.png'
import { IFeature } from './types'

const images = {
	rocketImg,
	moneyImg,
	listImg,
}

export const formLink = 'https://forms.gle/xMUXAnuUJnLcv8hf9'

const features: IFeature[] = [
	{
		icon: <DashboardLandingIcon />,
		title: 'landing_features_widgets_title',
		description: 'landing_features_widgets_description',
	},
	{
		icon: <ShieldLandingIcon />,
		title: 'landing_features_badges_title',
		description: 'landing_features_badges_description',
	},
	{
		icon: <CodeIcon />,
		title: 'landing_features_link_title',
		description: 'landing_features_link_description',
	},
	{
		icon: <LinkIcon />,
		title: 'landing_features_donations_title',
		description: 'landing_features_donations_description',
	},
	{
		icon: <PencilLandingIcon />,
		title: 'landing_features_customizable_title',
		description: 'landing_features_customizable_description',
	},
	{
		icon: <GraphIcon />,
		title: 'landing_features_reports_title',
		description: 'landing_features_reports_description',
	},
	{
		icon: <CrossIcon />,
		title: 'landing_features_fiat_title',
		description: 'landing_features_fiat_description',
	},
	{
		icon: <ClockIcon />,
		title: 'landing_features_nopending_title',
		description: 'landing_features_nopending_description',
	},
]

const cryptoSteps = [
	{
		title: 'landing_howWork_connection_title',
		description: 'landing_howWork_connection_description',
	},
	{
		title: 'landing_howWork_widget_title',
		description: 'landing_howWork_widget_description',
	},
	{
		title: 'landing_howWork_actions_title',
		description: 'landing_howWork_actions_description',
	},
]

const help = [
	// {
	//   title: "landing_help_discord_title",
	//   icon: <ChatIcon />,
	//   description: "landing_help_discord_description",
	//   link: "https://discord.gg/PHEQCjnY",
	// },
	{
		title: 'landing_help_telegram_title',
		icon: <ChatIcon />,
		description: 'landing_help_telegram_description',
		link: 'https://t.me/cryptodonutz_xyz',
	},
	{
		title: 'landing_help_center_title',
		icon: <HelpIcon />,
		description: 'landing_help_center_description',
		link: 'https://crypto-donutz.gitbook.io/product-docs/',
	},
]

const socialNetworks = [
	// {
	//   link: "https://discord.gg/PHEQCjnY",
	//   icon: <DiscordIcon />,
	// },
	{
		link: 'https://t.me/cryptodonutz_xyz',
		icon: <TelegramIcon />,
	},
	{
		link: 'https://twitter.com/CryptoDonutzzz',
		icon: <TwitterIcon />,
	},
]

export { images, features, cryptoSteps, help, socialNetworks }
