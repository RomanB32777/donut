import { useContext, useEffect } from "react";
import { Col, Row } from "antd";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

import { useAppSelector } from "hooks/reduxHooks";
import useWindowDimensions from "hooks/useWindowDimensions";
import { WalletContext } from "contexts/Wallet";
import { HeaderComponent } from "components/HeaderComponents/HeaderComponent";
import BaseButton from "components/BaseButton";
import Logo from "components/HeaderComponents/LogoComponent";

import { setSelectedBlockchain } from "store/types/Wallet";
import { checkWallet, scrollToPosition } from "utils";
import { adminPath, storageWalletKey } from "consts";
import {
  blockchains,
  cryptoSteps,
  features,
  help,
  images,
  socialNetworks,
} from "./const";
import "./styles.sass";

const LandingContainer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isMobile } = useWindowDimensions();
  const { id } = useAppSelector(({ user }) => user);
  const { walletConf } = useContext(WalletContext);

  const signUp = async () => {
    if (id) navigate(`/${adminPath}`);
    else navigate("/register");
    scrollToPosition();
  };

  useEffect(() => {
    localStorage.getItem(storageWalletKey) &&
      checkWallet({ walletConf, dispatch });
  }, [walletConf]);

  const { rocketImg, moneyImg, listImg } = images;

  return (
    <div className="landing">
      <HeaderComponent
        visibleLogo
        logoUrl={`/${adminPath}`}
        modificator="landing-header landing-padding"
      >
        <BaseButton
          title={id ? "Launch app" : "Connect wallet"}
          onClick={signUp}
          modificator="connect-btn"
          isMain
        />
      </HeaderComponent>

      <div className="landing-container landing-padding">
        <div className="banner">
          <div className="gradient-red-bg" />
          <div className="banner-content">
            <h1 className="title">
              Let's revolutionize the way crypto donations work
            </h1>
            <p className="subtitle">
              It's time to display crypto donations on a stream, mint NFTs for
              your supporters and have fun!
            </p>
            <BaseButton
              formatId={
                id ? "mainpage_main_button_logged" : "mainpage_main_button"
              }
              onClick={signUp}
              modificator="landing-btn center-btn"
              isMain
            />
          </div>
        </div>

        <div className="whatIs">
          <div className="gradient-blue-bg" />
          <div className="content">
            <Row justify="space-between" align={isMobile ? "top" : "middle"}>
              <Col xs={16} md={12}>
                <p className="subtitle">What is Crypto Donutz?</p>
                <h1 className="title">
                  Crypto donation platform for streamers
                </h1>
                <p className="description">
                  Our product is aimed to increase streamer’s revenue and
                  interaction with crypto supporters. It’s also extremely easy
                  to set up.
                </p>
                <BaseButton
                  title="Create account"
                  onClick={signUp}
                  modificator="landing-btn"
                  isMain
                />
              </Col>
              <Col xs={6} md={10}>
                <div className="image">
                  <img src={rocketImg} alt="rocket" />
                </div>
              </Col>
            </Row>
          </div>
        </div>

        <div className="features block">
          <div className="gradient-blue-bg" />
          <div className="content">
            <p className="subtitle">What's so special about us?</p>
            <h2 className="title">Our features</h2>
            <Row
              gutter={isMobile ? [16, 16] : [32, 32]}
              justify="space-between"
            >
              {features.map(({ title, icon, description }, index) => (
                <Col xs={24} md={12} key={index}>
                  <div className="card feature">
                    <div className="title">
                      <span className="icon">{icon}</span>
                      {title}
                    </div>
                    <p className="description">{description}</p>
                  </div>
                </Col>
              ))}
            </Row>
            <div className="commission block">
              <Row justify="space-between" align={isMobile ? "top" : "middle"}>
                <Col span={10}>
                  <div className="image">
                    <img src={moneyImg} alt="rocket" />
                  </div>
                </Col>
                <Col span={12}>
                  <div className="content">
                    <h2 className="title">3% commission</h2>
                    <div className="description">
                      We charge only 3% commission rate on donation received.
                      Lowest commission on the market.
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </div>

        <div className="howWork block">
          <div className="gradient-red-bg" />
          <Row justify="space-between" align={isMobile ? "top" : "middle"}>
            <Col span={16}>
              <div className="content">
                <p className="subtitle">How it all works?</p>
                <h2 className="title">Three steps process</h2>
                <div className="steps">
                  {cryptoSteps.map(({ title, description }, index) => (
                    <div className="step" key={index}>
                      <div className="title number">{index + 1}.</div>
                      <div className="text">
                        <h3 className="title">{title}</h3>
                        <p className="description">{description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Col>
            <Col span={7}>
              <div className="image">
                <img src={listImg} alt="list" />
              </div>
            </Col>
          </Row>
        </div>

        <div className="blockchains block">
          <p className="subtitle">Integrations</p>
          <h2 className="title">Supported crypto</h2>
          <div className="list">
            {blockchains.map(({ name, image, background }, index) => (
              <div className="blockchain" key={index}>
                <div className="icon" style={{ background }}>
                  <img src={image} alt={name} />
                </div>
                <p className="name">{name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="help block">
          <h2 className="title">Need help?</h2>
          <div className="list">
            {help.map(({ title, icon, description }, index) => (
              <div className="card" key={index}>
                <Row align="middle">
                  <Col span={6}>
                    <div className="image">{icon}</div>
                  </Col>
                  <Col span={18}>
                    <div className="text">
                      <p className="title">{title}</p>
                      <p className="description">{description}</p>
                    </div>
                  </Col>
                </Row>
              </div>
            ))}
          </div>
        </div>

        <div className="footer">
          <div className="gradient-blue-bg" />
          <div className="content">
            <h4 className="title">Are you ready to grab your Crypto donutz?</h4>
            <BaseButton
              formatId={
                id ? "mainpage_main_button_logged" : "mainpage_main_button"
              }
              onClick={signUp}
              modificator="landing-btn center-btn"
              isMain
            />
            <div className="contacts">
              <Logo />
              <div className="social-networks">
                {socialNetworks.map(({ link, icon }, index) => (
                  <a
                    key={index}
                    className="link"
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingContainer;
