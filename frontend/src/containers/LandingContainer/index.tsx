import { useEffect } from "react";
import { Carousel, Col, Row } from "antd";
import { FormattedMessage } from "react-intl";

import { useAppSelector } from "hooks/reduxHooks";
import useWindowDimensions from "hooks/useWindowDimensions";
import HeaderComponent from "components/HeaderComponents/HeaderComponent";
import Logo from "components/HeaderComponents/LogoComponent";
import LocalesSwitcher from "components/HeaderComponents/LocalesSwitcher";
import LandingButton from "./components/landing-button";
import Loader from "components/Loader";

import useAuth from "hooks/useAuth";
import { RoutePaths } from "consts";
import { fullChainsInfo } from "utils/wallets/wagmi";
import { cryptoSteps, features, help, images, socialNetworks } from "./const";
import { IFeature } from "./types";
import "./styles.sass";

const mobileFeaturesSteps = features.reduce((acc, curr, index) => {
  const step = Math.floor(index / 3);
  return { ...acc, [step]: acc[step] ? [...acc[step], curr] : [curr] };
}, {} as Record<string, IFeature[]>);

const LandingContainer = () => {
  const { isMobile } = useWindowDimensions();
  const { id } = useAppSelector(({ user }) => user);
  const { checkAuth, isAuthLoading } = useAuth();

  const blockchains = Object.values(fullChainsInfo);

  const { rocketImg, moneyImg, listImg } = images;

  useEffect(() => {
    if (!id) checkAuth(false);
  }, [id]);

  if (isAuthLoading) {
    return (
      <div className="appLoader">
        <Loader size="big" />
      </div>
    );
  }

  return (
    <div className="landing">
      <HeaderComponent
        logoUrl={
          id ? `/${RoutePaths.admin}/${RoutePaths.dashboard}` : RoutePaths.main
        }
        modificator="landing-header landing-padding"
        mobileContenCol={16}
        visibleLogo
      >
        <LocalesSwitcher modificator="localeModificator" />
        <LandingButton
          localeText={id ? "landing_launch_button" : "landing_connect_button"}
          modificator="connectBtn"
        />
      </HeaderComponent>

      <div className="landing-container landing-padding">
        <div className="banner">
          <div className="gradient-red-bg" />
          <div className="banner-content">
            <h1 className="title">
              <FormattedMessage id="landing_banner_title" />
            </h1>
            <p className="subtitle">
              <FormattedMessage id="landing_banner_subtitle" />
            </p>
            <LandingButton
              localeText={
                id ? "landing_main_button_logged" : "landing_main_button"
              }
              modificator="center-btn"
            />
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
                <p className="subtitle">
                  <FormattedMessage id="landing_whatIs_subtitle" />
                </p>
                <h1 className="title">
                  <FormattedMessage id="landing_whatIs_title" />
                </h1>
                <p className="description">
                  <FormattedMessage id="landing_whatIs_description" />
                </p>
                <LandingButton
                  localeText={
                    id
                      ? "landing_launch_button"
                      : "landing_create_account_button"
                  }
                />
              </Col>
            </Row>
          </div>
        </div>

        <div className="features block">
          <div className="gradient-blue-bg" />
          <div className="content">
            <p className="subtitle">
              <FormattedMessage id="landing_features_subtitle" />
            </p>
            <h2 className="title">
              <FormattedMessage id="landing_features_title" />
            </h2>
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
                      <FormattedMessage id={title} />
                    </div>
                    <p className="description">
                      <FormattedMessage id={description} />
                    </p>
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
                                <FormattedMessage id={title} />
                              </div>
                              <p className="description">
                                <FormattedMessage id={description} />
                              </p>
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
                    <h2 className="title">
                      <FormattedMessage id="landing_commission_title" />
                    </h2>
                    <div className="description">
                      <FormattedMessage id="landing_commission_description" />
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
                <p className="subtitle">
                  <FormattedMessage id="landing_howWork_subtitle" />
                </p>
                <h2 className="title">
                  <FormattedMessage id="landing_howWork_title" />
                </h2>
                <div className="steps">
                  {cryptoSteps.map(({ title, description }, index) => (
                    <div className="step" key={index}>
                      <div className="title number">{index + 1}.</div>
                      <div className="text">
                        <h3 className="title">
                          <FormattedMessage id={title} />
                        </h3>
                        <p className="description">
                          <FormattedMessage id={description} />
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Col>
          </Row>
        </div>

        <div className="blockchains block">
          <p className="subtitle">
            <FormattedMessage id="landing_blockchains_subtitle" />
          </p>
          <h2 className="title">
            <FormattedMessage id="landing_blockchains_title" />
          </h2>
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
            <h2 className="title">
              <FormattedMessage id="landing_help_title" />
            </h2>
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
                          <p className="title">
                            <FormattedMessage id={title} />
                          </p>
                          <p className="description">
                            <FormattedMessage id={description} />
                          </p>
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
            <h4 className="title">
              <FormattedMessage id="landing_footer_title" />
            </h4>
            <LandingButton
              localeText={
                id ? "landing_main_button_logged" : "landing_main_button"
              }
              modificator="center-btn"
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
