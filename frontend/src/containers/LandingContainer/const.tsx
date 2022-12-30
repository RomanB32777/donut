import {
  ChatIcon,
  ClockIcon,
  CodeIcon,
  CrossIcon,
  DashboardLandingIcon,
  GraphIcon,
  HelpIcon,
  LinkIcon,
  PencilLandingIcon,
  ShieldLandingIcon,
  TelegramIcon,
  TwitterIcon,
} from "../../icons";

import rocketImg from "../../assets/landing/rocket.png";
import listImg from "../../assets/landing/list.png";
import moneyImg from "../../assets/landing/money.png";

import ethImg from "../../assets/landing/eth.png";
import maticImg from "../../assets/landing/matic.png";
import usdcImg from "../../assets/landing/usdc.png";
import usdtImg from "../../assets/landing/usdt.png";
import bnbImg from "../../assets/landing/bnb.png";
import avaxImg from "../../assets/landing/avax.png";

const images = {
  rocketImg,
  moneyImg,
  listImg,
  ethImg,
  maticImg,
  usdcImg,
  usdtImg,
  bnbImg,
  avaxImg,
};

const features = [
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
    title: "mainpage_feature_five_title",
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

const blockchains = [
  {
    name: "ETH",
    image: images.ethImg,
    background: "rgba(242, 244, 247, 0.8)",
  },
  {
    name: "USDT",
    image: images.usdtImg,
    background: "rgba(0, 147, 147, 0.8)",
  },
  {
    name: "BNB",
    image: images.bnbImg,
    background: "rgba(240, 185, 11, 0.8)",
  },
  {
    name: "AVAX",
    image: images.avaxImg,
    background: "rgba(232, 65, 66, 0.8)",
  },
  {
    name: "USDC",
    image: images.usdcImg,
    background: "rgba(39, 117, 201, 0.8)",
  },
  {
    name: "MATIC",
    image: images.maticImg,
    background: "rgba(130, 71, 229, 0.8)",
  },
];

const help = [
  {
    title: "Ask in Telegram chat",
    icon: <ChatIcon />,
    description: "You can talk to our support team in the Telegram chat.",
  },
  {
    title: "Check help center",
    icon: <HelpIcon />,
    description: "We’ve collected all the FAQ in Help center. Check it out!",
  },
];

const socialNetworks = [
  {
    link: "",
    icon: <TelegramIcon />,
  },
  {
    link: "",
    icon: <TwitterIcon />,
  },
];

export { images, features, cryptoSteps, blockchains, help, socialNetworks };
