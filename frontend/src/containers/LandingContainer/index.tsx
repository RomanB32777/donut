import { useState } from "react";
import { Col, Row } from "antd";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";
import {
  DashboardLandingIcon,
  DonationLandingIcon,
  PencilLandingIcon,
  ShieldLandingIcon,
  WidgetsLandingIcon,
} from "../../icons/icons";
import { BlueDonut } from "../../assets/blueDonut";
import { HeaderComponent } from "../../components/HeaderComponents/HeaderComponent";
import { HeaderBanner } from "../../components/HeaderComponents/HeaderBanner";
import BaseButton from "../../components/BaseButton";
import "./styles.sass";

const cryptoSteps = [
  {
    title: "mainpage_crypto_steps_step_one_title",
    subtitle: "mainpage_crypto_steps_step_one_subtitle",
  },
  {
    title: "mainpage_crypto_steps_step_two_title",
    subtitle: "mainpage_crypto_steps_step_two_subtitle",
  },
  {
    title: "mainpage_crypto_steps_step_three_title",
    subtitle: "mainpage_crypto_steps_step_three_subtitle",
  },
];

const features = [
  {
    icon: <DashboardLandingIcon />,
    title: "mainpage_feature_one_title",
    subtitle: "mainpage_feature_one_subtitle",
  },
  {
    icon: <WidgetsLandingIcon />,
    title: "mainpage_feature_two_title",
    subtitle: "mainpage_feature_two_subtitle",
  },
  {
    icon: <ShieldLandingIcon />,
    title: "mainpage_feature_three_title",
    subtitle: "mainpage_feature_three_subtitle",
  },
  {
    icon: <PencilLandingIcon />,
    title: "mainpage_feature_four_title",
    subtitle: "mainpage_feature_four_subtitle",
  },
  {
    icon: <DonationLandingIcon />,
    title: "mainpage_feature_five_title",
    subtitle: "mainpage_feature_five_subtitle",
  },
];

const LandingContainer = () => {
  const navigate = useNavigate();
  const user: any = useSelector((state: any) => state.user);

  const [isOpenHeaderSelect, setIsOpenHeaderSelect] = useState<boolean>(false);

  const handlerHeaderSelect = () => {
    setIsOpenHeaderSelect(!isOpenHeaderSelect);
  };

  const signUp = async () => {
    user.id ? navigate("/") : navigate("/login");
  };

  return (
    <>
      <HeaderBanner />
      <HeaderComponent
        visibleLogo
        isOpenHeaderSelect={isOpenHeaderSelect}
        handlerHeaderSelect={handlerHeaderSelect}
        logoUrl={user.id ? "/" : "/landing"}
      />
      <div className="landing-container">
        <div
          className="landing-container__first-mocup"
          style={{
            height: "840px",
          }}
        >
          <div className="landing-container__first-mocup__background" />
          <div className="landing-container__first-mocup__title">
            <span>
              <FormattedMessage id="mainpage_main_title" />
            </span>
            <BaseButton
              formatId={
                user && user.id
                  ? "mainpage_main_button_logged"
                  : "mainpage_main_button"
              }
              onClick={signUp}
              padding={document.body.clientWidth > 640 ? "23px" : "17px"}
              fontSize={document.body.clientWidth > 640 ? "30px" : "24px"}
              isBlue
            />
          </div>
        </div>

        <div
          className="landing-container__video-wrapper"
          style={{
            marginBottom: "0px",
          }}
        >
          <span>What is Crypto Donutz?</span>
          <iframe
            width="1120"
            height="630"
            // width="560"
            // height="315"
            src="https://www.youtube.com/embed/ng-7g2x4GnM"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen={true}
          />
        </div>

        <div className="landing-container__row-panel">
          <span>
            <FormattedMessage id="mainpage_crypto_steps_title" />
          </span>
          <Row
            justify="space-around"
            style={{
              width: "90%",
            }}
          >
            {cryptoSteps.map((cryptoStep, cryptoStepIndex) => (
              <Col key={"mainpage_crypto_steps_" + cryptoStepIndex}>
                <span className="icon">{cryptoStepIndex + 1}</span>
                <span className="title">
                  <FormattedMessage id={cryptoStep.title} />
                </span>
                <span className="sub-title">
                  <FormattedMessage id={cryptoStep.subtitle} />
                </span>
              </Col>
            ))}
          </Row>
        </div>

        <div className="landing-container__big-mocup">
          <div>
            <FormattedMessage id="mainpage_submocup_title" />
          </div>
        </div>

        <div className="landing-container__row-panel">
          <span>
            <FormattedMessage id="mainpage_features_title" />
          </span>
          <Row
            justify="center"
            className="landing-container__row-panel-features"
            style={{
              width: "90%",
            }}
          >
            {features.map((feature) => (
              <Col
                lg={8}
                md={12}
                xs={24}
                className="landing-container__row-panel-features_item"
                key={"mainpage_features_" + feature.title}
              >
                <span className="icon" style={{ marginBottom: "-12px" }}>
                  {feature.icon}
                </span>
                <span className="title">
                  <FormattedMessage id={feature.title} />
                </span>
                <span className="sub-title">
                  <FormattedMessage id={feature.subtitle} />
                </span>
              </Col>
            ))}
          </Row>

          <div
            className="landing-container__donut-panel"
            style={{
              justifyContent: "space-between",
            }}
          >
            <BlueDonut />
            <div>
              <span className="title">
                <FormattedMessage id="mainpage_donut_mocup_title" />
              </span>
              <span className="subtitle">
                <FormattedMessage id="mainpage_donut_mocup_subtitle" />
              </span>
            </div>
          </div>

          {/* <div
          className="main-container__video-wrapper"
          style={{
            flexDirection: "column",
            marginBottom: "64px",
          }}
        >
          <span>Product Walkthrough</span>
          <iframe
            width="1120"
            height="630"
            src="https://www.youtube.com/embed/fYYqsa102AY"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div> */}

          <div className="landing-container__bottom-panel">
            <div>
              <span>
                <FormattedMessage id="mainpage_bottom_panel_title" />
              </span>
              <BaseButton
                onClick={signUp}
                fontSize={document.body.clientWidth > 640 ? "30px" : "24px"}
                formatId={
                  user && user.id
                    ? "mainpage_main_button_logged"
                    : "mainpage_main_button"
                }
                padding={
                  document.body.clientWidth > 640 ? "22px 78px" : "12px 64px"
                }
                isBlue
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingContainer;
