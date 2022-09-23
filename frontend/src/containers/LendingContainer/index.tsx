import { FormattedMessage } from "react-intl";
import BlueButton from "../../commonComponents/BlueButton";
import {
  ChartLineIcon,
  LeftRightArrowsIcon,
  PersonCardIcon,
} from "../../icons/icons";
import getTronWallet, {
  getMetamaskWallet,
  metamaskWalletIsIntall,
  tronWalletIsIntall,
} from "../../functions/getTronWallet";
import postData from "../../functions/postData";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  openAuthTronModal,
  openAuthWalletsModal,
  openRegistrationModal,
} from "../../store/types/Modal";
import routes from "../../routes";
import "./styles.sass";

import { BlueDonut } from "../../assets/blueDonut";
import { baseURL } from "../../axiosClient";
import { tryToGetUser } from "../../store/types/User";
import { setMainWallet } from "../../store/types/Wallet";

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
    icon: <ChartLineIcon />,
    title: "mainpage_feature_one_title",
    subtitle: "mainpage_feature_one_subtitle",
  },
  {
    icon: <LeftRightArrowsIcon />,
    title: "mainpage_feature_two_title",
    subtitle: "mainpage_feature_two_subtitle",
  },
  {
    icon: <PersonCardIcon />,
    title: "mainpage_feature_three_title",
    subtitle: "mainpage_feature_three_subtitle",
  },
];

const LendingContainer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const checkIsExist = async (token: string) => {
    postData("/api/user/check-user-exist/", { token }).then((data) => {
      if (data.notExist) {
        dispatch(openRegistrationModal());
      } else {
        dispatch(tryToGetUser(token));
        navigate(routes.profile);
      }
    });
  };

  const user: any = useSelector((state: any) => state.user);

  const signUp = async () => {
    if (
      tronWalletIsIntall() &&
      metamaskWalletIsIntall() &&
      !user.id
    ) {
      dispatch(openAuthWalletsModal());
    } else if (tronWalletIsIntall() || metamaskWalletIsIntall()) {
      let wallet = {
        token: "",
        wallet: "",
      };
      if (tronWalletIsIntall()) {
        wallet = {
          wallet: "tron",
          token: getTronWallet(),
        };
      } else if (metamaskWalletIsIntall()) {
        const tokenMeta = await getMetamaskWallet();
        wallet = {
          wallet: "metamask",
          token: tokenMeta,
        };
      }
      if (user && user.id) {
        navigate(routes.profile);
      } else {
        if (wallet.token) {
          checkIsExist(wallet.token);
          dispatch(setMainWallet(wallet));
          sessionStorage.setItem("main_wallet", JSON.stringify(wallet));
        } else {
          dispatch(openRegistrationModal());
        }
      }
    } else {
      dispatch(openAuthWalletsModal());
    }
  }

  return (
    <div className="main-container">
      <div
        className="main-container__first-mocup"
        style={{
          height: "840px",
        }}
      >
        <div className="main-container__first-mocup__background" />
        <div className="main-container__first-mocup__title">
          <span>
            <FormattedMessage id="mainpage_main_title" />
          </span>
          <BlueButton
            formatId={
              user && user.id
                ? "mainpage_main_button_logged"
                : "mainpage_main_button"
            }
            onClick={signUp}
            padding={document.body.clientWidth > 640 ? "23px" : "17px"}
            fontSize={document.body.clientWidth > 640 ? "30px" : "24px"}
          />
        </div>
      </div>

      <div
        className="main-container__video-wrapper"
        style={{
          marginBottom: "0px",
        }}
      >
        <span>What is Crypto Donutz?</span>
        <iframe
          width="1120"
          height="630"
          src="https://www.youtube.com/embed/31tneq73SlY"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen={true}
        ></iframe>
      </div>

      <div className="main-container__row-panel">
        <span>
          <FormattedMessage id="mainpage_crypto_steps_title" />
        </span>
        <div>
          {cryptoSteps.map((cryptoStep, cryptoStepIndex) => (
            <div key={"mainpage_crypto_steps_" + cryptoStepIndex}>
              <span className="icon">{cryptoStepIndex + 1}</span>
              <span className="title">
                <FormattedMessage id={cryptoStep.title} />
              </span>
              <span className="sub-title">
                <FormattedMessage id={cryptoStep.subtitle} />
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="main-container__big-mocup">
        <div>
          <FormattedMessage id="mainpage_submocup_title" />
        </div>
      </div>

      <div className="main-container__row-panel">
        <span>
          <FormattedMessage id="mainpage_features_title" />
        </span>
        <div>
          {features.map((feature) => (
            <div key={"mainpage_features_" + feature.title}>
              <span className="icon" style={{ marginBottom: "-12px" }}>
                {feature.icon}
              </span>
              <span className="title">
                <FormattedMessage id={feature.title} />
              </span>
              <span className="sub-title">
                <FormattedMessage id={feature.subtitle} />
              </span>
            </div>
          ))}
        </div>

        <div className="main-container__donut-panel">
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

        <div className="main-container__bottom-panel">
          <div>
            <span>
              <FormattedMessage id="mainpage_bottom_panel_title" />
            </span>
            <BlueButton
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
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LendingContainer;