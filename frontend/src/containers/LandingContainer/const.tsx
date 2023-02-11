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
} from "icons";

import rocketImg from "assets/landing/rocket.png";
import listImg from "assets/landing/list.png";
import moneyImg from "assets/landing/money.png";
import { IFeature } from "./types";

const images = {
  rocketImg,
  moneyImg,
  listImg,
};

const features: IFeature[] = [
  {
    icon: <DashboardLandingIcon />,
    title: "In-stream widgets",
    description:
      "Display every crypto donation on the stream, highlight you most active supporters, create donation goals and let your audience be involved.",
  },
  {
    icon: <ShieldLandingIcon />,
    title: "Badges as NFTs",
    description:
      "Why not grant your valuable supporters with unique badge? Especially with NFT one. Your crypto supporters will definitely love it.",
  },

  {
    icon: <CodeIcon />,
    title: "One link integration",
    description:
      "One link is all it takes. Just copy and paste your widget link to OBS or any other broadcast software you use. Start displaying your incoming donations on a stream.",
  },
  {
    icon: <LinkIcon />,
    title: "Donation page link",
    description:
      "Copy your unique donation page link and give it to your supporters. Increase your conversion rate and therefore your revenue.",
  },
  {
    icon: <PencilLandingIcon />,
    title: "Everything is customizable",
    description:
      "Use your own distinctive colors, texts and images. Customize widgets and donation page. Your imagination is the only limit.",
  },
  {
    icon: <GraphIcon />,
    title: "Donation reports",
    description:
      "Our visual graphs and summary reports will get the most out of your donation breakdown. Use time filters to see the donations for any time period.",
  },
  {
    icon: <CrossIcon />,
    title: "Compatible with fiat services",
    description:
      "Crypto Donutz is designed to make the best use of blockchain technology. Use both fiat and crypto services to maximize your profit.",
  },
  {
    icon: <ClockIcon />,
    title: "No pending balances",
    description:
      "Every transaction is processed via smart contract and donation goes directly to your wallet address. We have no control over your money.",
  },
];

const cryptoSteps = [
  {
    title: "Metamask wallet connection",
    description:
      "Sign-up with your Metamask wallet, choose the user name and register account.",
  },
  {
    title: "Widget and donation page set up",
    description:
      "Go to Widgets section, copy widget link and paste it to your broadcast software. Get your donation page link in Donation page section and give it to your supporters.",
  },
  {
    title: "Get your tasty Crypto Donutz",
    description:
      "Mint NFT badges to your most active supporters, analyze your donation reports and have fun!",
  },
];

const help = [
  {
    title: "Ask in discord",
    icon: <ChatIcon />,
    description:
      "Create ticket on our discord server and talk to our support team",
    link: "https://discord.gg/PHEQCjnY",
  },
  {
    title: "Check help center",
    icon: <HelpIcon />,
    description: "We've collected all the FAQ in Help center. Check it out!",
    link: "https://crypto-donutz.gitbook.io/product-docs/",
  },
];

const socialNetworks = [
  {
    link: "https://discord.gg/PHEQCjnY",
    icon: <DiscordIcon />,
  },
  {
    link: "https://t.me/cryptodonutz_xyz",
    icon: <TelegramIcon />,
  },
  {
    link: "https://twitter.com/CryptoDonutzzz",
    icon: <TwitterIcon />,
  },
];

export { images, features, cryptoSteps, help, socialNetworks };
