import accountImg1 from "assets/helpCenter/helpAccount1.png";
import { themesType } from "./types";

const themes: themesType[] = [
  {
    label: "Account",
    children: [
      {
        label: "How to create a streamer account?",
        content: [
          {
            text: "In order to create a content creator account please do these 2 simple steps:",
            steps: [
              {
                text: `Click the “Sign-up” button and login to your 
                  <a 
                    href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Metamask wallet
                  </a>.`,
                image: accountImg1,
              },
              "Choose the username you want to sign-up with.",
            ],
          },
        ],
      },
      {
        label: "How to change the username?",
        content: [
          {
            text: "To change the username, please go to “Settings” section in the left menu and click “Change” button",
            image: "",
          },
        ],
      },
    ],
  },
  {
    label: "Badges",
    children: [
      {
        label: "What is badge?",
        content: [
          "You may think of a badge as a distinguishing mark that you can assign your supporters with. By giving it to the fans you can highlight them, create off-stream value and increase loyalty of your audience.",
          "Technically speaking, the badge is the ERC-1155 token that's deployed on the Polygon blockchain. The badges are cheap as well as secure and reliable to mint and work with.",
          "Badge contract address: asdfasfasfasfafa",
        ],
      },
      {
        label: "Minting costs",
        content: [
          "Gas amount to mint the badge is ….. However, the price of gas varies, right now it's … USD.",
        ],
      },
      {
        label: "Badge application",
        content: [
          {
            text: "Once you've minted some badges to your wallet you can assign them to your supporters by opening the badge menu, choosing the supporter and clicking the “Assign” button.",
            image: "",
          },
          "After receiving the badge, the supporter has full control over it and can do whatever he wants to: transfer, sell or publish it in social media, etc.",
        ],
      },
    ],
  },
  {
    label: "Widgets",
    children: [
      {
        label: "Customization",
        content: [
          "We believe that every streamer is unique and our goal is to help streamers create distinctive experiences for their audience. That's why all widgets and donation page are customizable.",
          "Choose your own texts, colors, sounds, images, fonts. You can also choose one of our default design templates, it's all up to you!",
        ],
      },
      {
        label: "Broadcast software setup",
        content: [
          {
            text: "In order to set up your donation alert widget, please do the following steps:",
            steps: [
              "Log-in your account",
              "Go to “Widgets” section in the left menu and select “Alerts” subsection",
              {
                text: "Copy the donation alert link",
                image: "",
              },
            ],
          },
        ],
      },
      {
        label: "Spam filtering",
        content: [
          {
            text: "If you don’t want spam or bad words to appear on your stream, you can enable spam filtering in the “Settings” section.",
            image: "",
          },
        ],
      },
    ],
  },
  {
    label: "Donations",
    children: [
      {
        label: "How does it all work?",
        content: [
          "With the help of blockchain all donations are processed in a decentralized way and it goes directly to the wallet you’re signed in on our website. We charge only 3% on the donation received via our platform.",
          "We don't have control over your money or pending balance period. Everything is fast and furious.",
          "We support multiple ERC-20 tokens: ETH, USDT, USDC, AVAX, BNB, MATIC. So, when a supporter sends you a donation in MATIC, it will appear on a Polygon chain in your Metamask wallet.",
          "Smart contract addresses:",
        ],
      },
    ],
  },
];

const images = {
  // rocketImg, helpTest
  // moneyImg,
  // listImg,
};

export { images, themes };
