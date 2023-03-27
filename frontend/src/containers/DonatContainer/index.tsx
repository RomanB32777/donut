import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import clsx from "clsx";
import { useAccount, useBalance, useSwitchNetwork } from "wagmi";
import { FormattedMessage } from "react-intl";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { ISendDonat, sendDonatFieldsKeys } from "types";

import { useAppSelector } from "hooks/reduxHooks";
import useWindowDimensions from "hooks/useWindowDimensions";

import WalletBlock from "components/HeaderComponents/WalletBlock";
import FormInput from "components/FormInput";
import BaseButton from "components/BaseButton";
import Loader from "components/Loader";
import AmountInput from "./components/AmountInput";
import Goals from "./components/Goals";
import {
  LoadingModalComponent,
  SuccessModalComponent,
} from "components/ModalComponent";
import HeaderComponent from "components/HeaderComponents/HeaderComponent";
import SwitchForm from "components/SwitchForm";
import LocalesSwitcher from "components/HeaderComponents/LocalesSwitcher";

import useAuth from "hooks/useAuth";
import { useGetCreatorInfoQuery } from "store/services/UserService";
import { addNotFoundUserNotification, addNotification } from "utils";
import { usePayment } from "./utils";
import { dummyImg, RoutePaths, initSendDonatData, initUser } from "consts";
import { IFormHandler } from "./types";

import SpaceImg from "assets/space.png";
import "./styles.sass";

const maxLengthDescription = 150;
const requiredFormFields: sendDonatFieldsKeys[] = [
  "sum",
  "username",
  "message",
];

const DonatContainer = () => {
  const navigate = useNavigate();
  const { name } = useParams();
  const { checkAuth } = useAuth();
  const {
    data: personInfo,
    isError,
    isLoading: isGetCreatorLoading,
  } = useGetCreatorInfoQuery(name ?? skipToken);

  const { address } = useAccount();
  const { switchNetwork, isLoading: isSwitchLoading } = useSwitchNetwork();
  const { data: balanceData, isLoading: isBalanceLoading } = useBalance({
    address,
  });

  const user = useAppSelector(({ user }) => user);
  const { isMobile } = useWindowDimensions();

  const [usdtKoef, setUsdtKoef] = useState(0);
  const [form, setForm] = useState<ISendDonat>(initSendDonatData);
  // const [isOpenErrorModal, setIsOpenErrorModal] = useState(false);
  const [notValidFields, setNotValidFields] = useState<sendDonatFieldsKeys[]>(
    []
  );

  const { id, username: usernameState } = user;
  const {
    username,
    message,
    sum,
    blockchain: selectedBlockchain,
    isAnonymous,
  } = form;

  const { triggerContract, isLoading, isSuccess } = usePayment({
    form,
    supporterInfo: user,
    creatorInfo: personInfo || initUser,
    balance: balanceData ? +balanceData.formatted : 0,
  });

  const formHandler = useCallback(({ field, value }: IFormHandler) => {
    setNotValidFields((prev) => prev.filter((f) => f !== field));
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const usernameHandler = useCallback(
    (value: string) => {
      if (!username) {
        setForm((prev) => ({
          ...prev,
          username: "@" + value,
        }));
      } else if (value.length < username.length && value.length === 2) {
        setForm((prev) => ({
          ...prev,
          username: "",
        }));
      } else {
        formHandler({ field: "username", value });
        setNotValidFields((prev) => prev.filter((f) => f !== "username"));
        setForm((prev) => ({
          ...prev,
          username: value,
        }));
      }
    },
    [username]
  );

  const closeSuccessPopup = () =>
    navigate(`/${RoutePaths.admin}/${RoutePaths.donations}`);

  const sendBtnHandler = useCallback(async () => {
    const keys = Object.keys(form) as sendDonatFieldsKeys[];
    const notValidFields = keys.filter((key) => {
      if (requiredFormFields.includes(key as any)) return !Boolean(form[key]);
      return false;
    });

    if (notValidFields.length) {
      setNotValidFields(notValidFields);
      addNotification({
        type: "warning",
        title: "Not all fields are filled",
      });
    } else if (personInfo) await triggerContract();
  }, [form, personInfo]);

  const isNotValidAmountField = useMemo(
    () => notValidFields.includes("sum"),
    [notValidFields]
  );

  useEffect(() => {
    if (id) {
      setForm((prev) => ({ ...prev, username: usernameState }));
    } else {
      checkAuth(false);
    }
  }, [id, usernameState]);

  if (!personInfo) {
    if (!isGetCreatorLoading || isError) addNotFoundUserNotification();
    return null;
  }

  const {
    creator,
    avatarLink,
    walletAddress,
    username: personUsername,
  } = personInfo;

  // !blockchain ||
  if (!creator) {
    return (
      <div className="loader-page">
        <Loader size="big" />
      </div>
    );
  }

  if (!walletAddress) {
    return (
      <>
        Этот еблан с именем {personUsername} не подключил еще кошелек, так что
        иди-ка ты нахуй отсюда - тебе тут пока не рады!
      </>
    );
  }

  const {
    backgroundBanner,
    headerBanner,
    backgroundColor,
    mainColor,
    welcomeText,
    btnText,
  } = creator;

  // if (isOpenErrorModal)
  //   return (
  //     <ErrorModalComponent
  //       open={true}
  //       centered={true}
  //       // href="${walletConf.main_contract.linkInstall}"
  //       message={`
  //         It seems that you don't have a Metamask wallet in your browser. To download it <a
  //             target="_blank"
  //             rel="noreferrer"
  //         >
  //           click here
  //         </a>!`}
  //     />
  //   );

  return (
    <div
      className="donat-wrapper"
      style={{
        backgroundColor: backgroundColor,
        backgroundImage: `url(${backgroundBanner})`,
      }}
    >
      <HeaderComponent
        logoUrl={
          id ? `/${RoutePaths.admin}/${RoutePaths.donations}` : RoutePaths.main
        }
        modificator="headerBlock"
        contentModificator="headerBlock-content"
        visibleLogo
      >
        <LocalesSwitcher />
        <WalletBlock
          modificator="donut-wallet"
          isPropLoading={isSwitchLoading}
        />
      </HeaderComponent>
      <div className="donat-container">
        <div className="info">
          <div className="background">
            <img src={headerBanner || SpaceImg} alt="banner" />
          </div>

          <div className="information-wrapper">
            <div className="main-info">
              <div className="picture">
                <img src={avatarLink || dummyImg} alt="avatar" />
              </div>
              <div className="personal">
                <span className="title">{welcomeText}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="payment_wrapper">
          <div className="payment">
            <div className="row">
              <div className="column">
                <div className="inputs">
                  <div className="item">
                    <FormInput
                      value={username}
                      setValue={usernameHandler}
                      disabled={
                        Boolean(usernameState) || isBalanceLoading || isLoading
                      }
                      modificator={clsx("inputs-name", {
                        isNotValid: notValidFields.includes("username"),
                      })}
                      addonsModificator="inputs-addon"
                      placeholder="donat_form_username"
                      addonAfter={
                        <div className="username-switch">
                          <SwitchForm
                            label={
                              !isMobile ? (
                                <FormattedMessage id="donat_form_switch_label" />
                              ) : (
                                ""
                              )
                            }
                            checked={isAnonymous}
                            setValue={(flag) =>
                              setForm({ ...form, isAnonymous: flag })
                            }
                            labelModificator="switch-label"
                            maxWidth={250}
                            labelCol={18}
                            switchCol={6}
                            gutter={[0, 18]}
                            tooltipTitle={
                              <FormattedMessage id="donat_form_switch_label" />
                            }
                          />
                        </div>
                      }
                    />
                  </div>
                  <div className="item">
                    <FormInput
                      value={message}
                      setValue={(message) =>
                        formHandler({ field: "message", value: message })
                      }
                      modificator={clsx("nputs-messag", {
                        isNotValid: notValidFields.includes("message"),
                      })}
                      placeholder="donat_form_message"
                      placeholderValues={{ username: personInfo.username }}
                      maxLength={maxLengthDescription}
                      disabled={isBalanceLoading || isLoading}
                      isVisibleLength
                      isTextarea
                    />
                  </div>
                  <AmountInput
                    form={form}
                    color={mainColor}
                    usdtKoef={usdtKoef}
                    isLoading={isSwitchLoading}
                    isNotValid={isNotValidAmountField}
                    formHandler={formHandler}
                    setUsdtKoef={setUsdtKoef}
                    switchNetwork={switchNetwork}
                  />
                </div>

                <Goals personInfo={personInfo} form={form} setForm={setForm} />

                <div className="bottom">
                  <BaseButton
                    title={btnText || "Donate"}
                    onClick={sendBtnHandler}
                    padding="10px 25px"
                    fontSize="21px"
                    color={mainColor}
                    disabled={isBalanceLoading || isLoading}
                    isMain
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <LoadingModalComponent
          open={!notValidFields.length && (isBalanceLoading || isLoading)}
          message={<FormattedMessage id="donat_loading_message" />}
          centered
        />
        <SuccessModalComponent
          open={isSuccess}
          onClose={closeSuccessPopup}
          message={
            <FormattedMessage
              id="donat_success_message"
              values={{ sum, selectedBlockchain, name }}
            />
          }
          description={
            <FormattedMessage id="donat_success_message_description" />
          }
        />
      </div>
    </div>
  );
};

export default DonatContainer;
