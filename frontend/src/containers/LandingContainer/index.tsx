import { FC, memo, useCallback, useContext, useEffect, useMemo } from "react";
import { Carousel, Col, Row } from "antd";
import { useNavigate } from "react-router";

import { useAppSelector } from "hooks/reduxHooks";
import useWindowDimensions from "hooks/useWindowDimensions";
import { WalletContext } from "contexts/Wallet";
import HeaderComponent from "components/HeaderComponents/HeaderComponent";
import BaseButton from "components/BaseButton";
import Logo from "components/HeaderComponents/LogoComponent";

import { useWallet } from "hooks/walletHooks";
import { scrollToPosition } from "utils";
import { RoutePaths } from "routes";
import { storageWalletKey } from "consts";
import { cryptoSteps, features, help, images, socialNetworks } from "./const";
import { IFeature } from "./types";
import "./styles.sass";

interface ILandingBtn {
  id: number;
  signUp: () => Promise<void>;
}

const mobileFeaturesSteps = features.reduce((acc, curr, index) => {
  const step = Math.floor(index / 3);
  return { ...acc, [step]: acc[step] ? [...acc[step], curr] : [curr] };
}, {} as Record<string, IFeature[]>);

const LandingBtn: FC<ILandingBtn> = memo(({ id, signUp }) => (
  <BaseButton
    formatId={id ? "mainpage_main_button_logged" : "mainpage_main_button"}
    onClick={signUp}
    modificator="landing-btn center-btn"
    isMain
  />
));

const LandingContainer = () => {
  const navigate = useNavigate();
  const { checkWallet } = useWallet();
  const { isMobile } = useWindowDimensions();
  const { id } = useAppSelector(({ user }) => user);
  const walletConf = useContext(WalletContext);

  const signUp = useCallback(async () => {
    const redirectToDashboard = async () => {
      const isExist = await checkWallet(true);
      if (isExist) {
        scrollToPosition();
        navigate(`/${RoutePaths.admin}/${RoutePaths.dashboard}`);
        return true;
      }
      return false;
    };

    if (id) navigate(`/${RoutePaths.admin}/${RoutePaths.dashboard}`);
    else {
      const isRedirect = await redirectToDashboard();
      if (!isRedirect) {
        const isUnlockedWallet = await walletConf.requestAccounts();
        if (isUnlockedWallet) navigate(`/${RoutePaths.register}`);
      }
    }
  }, [id, walletConf]);

  const blockchains = useMemo(
    () => walletConf.main_contract.blockchains,
    [walletConf]
  );

  useEffect(() => {
    localStorage.getItem(storageWalletKey) && checkWallet();
  }, []);

  const { rocketImg, moneyImg, listImg } = images;

  return (
    <div className="landing">
      <HeaderComponent
        visibleLogo
        logoUrl={`/${RoutePaths.admin}/${RoutePaths.dashboard}`}
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
            <LandingBtn id={id} signUp={signUp} />
          </div>
        </div>

        <div className="whatIs">
          <div className="gradient-blue-bg" />
          <div className="content">
            <Row justify="space-between" align={isMobile ? "top" : "middle"}>
              <Col xs={1} md={10} order={1}>
                <div className="image">
                  <img src={rocketImg} alt="rocket" />
                </div>
              </Col>
              <Col xs={23} md={12} order={0}>
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
                  title={id ? "Launch app" : "Create account"}
                  onClick={signUp}
                  modificator="landing-btn"
                  isMain
                />
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
              gutter={[32, 32]}
              justify="space-between"
              className="features-list desktop"
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
            <div className="features-list mobile">
              <Carousel slidesToShow={1} draggable swipeToSlide>
                {Object.keys(mobileFeaturesSteps).map((step) => {
                  return (
                    <Row
                      gutter={[0, 10]}
                      justify="space-between"
                      key={`mobile-row-${step}`}
                    >
                      {mobileFeaturesSteps[step].map(
                        ({ title, icon, description }, index) => (
                          <Col
                            xs={24}
                            md={12}
                            key={`mobile-${index}`}
                            className="moblie-col"
                          >
                            <div className="card feature">
                              <div className="title">
                                <span className="icon">{icon}</span>
                                {title}
                              </div>
                              <p className="description">{description}</p>
                            </div>
                          </Col>
                        )
                      )}
                    </Row>
                  );
                })}
              </Carousel>
            </div>
            <div className="commission block">
              <Row justify="space-between" align={isMobile ? "top" : "middle"}>
                <Col xs={{ span: 1, order: 1 }} md={{ span: 10, order: 0 }}>
                  <div className="image">
                    <img src={moneyImg} alt="rocket" />
                  </div>
                </Col>
                <Col xs={{ span: 23, order: 0 }} md={{ span: 12, order: 1 }}>
                  <div className="content">
                    <h2 className="title">0% commission</h2>
                    <div className="description">
                      Right now the service is completely free to use for
                      everyone
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
            <Col xs={1} md={7} order={1}>
              <div className="image">
                <img src={listImg} alt="list" />
              </div>
            </Col>
            <Col xs={23} md={16} order={0}>
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
          </Row>
        </div>

        <div className="blockchains block">
          <p className="subtitle">Integrations</p>
          <h2 className="title">Supported crypto</h2>
          <div className="list">
            <Carousel
              autoplay
              dots={false}
              slidesToShow={blockchains.length < 6 ? blockchains.length : 6}
              speed={500}
              draggable
              swipeToSlide
              responsive={[
                {
                  breakpoint: 1200,
                  settings: {
                    slidesToShow:
                      blockchains.length < 4 ? blockchains.length : 4,
                  },
                },
              ]}
            >
              {blockchains.map(({ nativeCurrency, icon, color }, index) => (
                <div className="blockchain" key={index}>
                  <div className="icon" style={{ background: color }}>
                    <div className="image">
                      <img src={icon} alt={nativeCurrency.symbol} />
                    </div>
                  </div>
                  <p className="name">{nativeCurrency.symbol}</p>
                </div>
              ))}
            </Carousel>
          </div>
        </div>

        {!isMobile && (
          <div className="help block">
            <h2 className="title">Need help?</h2>
            <div className="list">
              {help.map(({ title, icon, description, link }, index) => (
                <a key={index} href={link} target="_blank" rel="noreferrer">
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
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="footer">
          <div className="gradient-blue-bg" />
          <div className="content">
            <h4 className="title">Are you ready to grab your Crypto donutz?</h4>
            <LandingBtn id={id} signUp={signUp} />

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
