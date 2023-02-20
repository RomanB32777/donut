import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import clsx from "clsx";
import { ISendDonat, requiredFields, sendDonatFieldsKeys } from "types";

import { WalletContext } from "contexts/Wallet";
import { useAppSelector } from "hooks/reduxHooks";
import useWindowDimensions from "hooks/useWindowDimensions";

import WalletBlock from "components/HeaderComponents/WalletBlock";
import FormInput from "components/FormInput";
import BaseButton from "components/BaseButton";
import Loader from "components/Loader";
import AmountInput from "./components/AmountInput";
import Goals from "./components/Goals";
import {
  ErrorModalComponent,
  LoadingModalComponent,
  SuccessModalComponent,
} from "components/ModalComponent";
import HeaderComponent from "components/HeaderComponents/HeaderComponent";
import SwitchForm from "components/SwitchForm";

import { useWallet } from "hooks/walletHooks";
import { useGetCreatorInfoQuery } from "store/services/UserService";
import { addNotFoundUserNotification, addNotification } from "utils";
import { usePayment } from "./utils";
import { RoutePaths } from "routes";
import { dummyImg, initSendDonatData, initUser } from "consts";
import { IFormHandler } from "./types";

import SpaceImg from "assets/space.png";
import "./styles.sass";

const maxLengthDescription = 150;
const requiredFormFields: requiredFields[] = ["amount", "username", "message"];

const DonatContainer = () => {
  const navigate = useNavigate();
  const { name } = useParams();
  const { checkWallet } = useWallet();
  const { data: personInfo, isError } = useGetCreatorInfoQuery(name as string, {
    skip: !name,
  });

  const user = useAppSelector(({ user }) => user);
  const blockchain = useAppSelector(({ blockchain }) => blockchain);

  const { isMobile } = useWindowDimensions();

  const walletConf = useContext(WalletContext);

  const [usdtKoef, setUsdtKoef] = useState(0);
  const [balance, setBalance] = useState(0);
  const [form, setForm] = useState<ISendDonat>(initSendDonatData);
  const [loadingPage, setLoadingPage] = useState(false);
  const [isOpenErrorModal, setIsOpenErrorModal] = useState(false);
  const [notValidFields, setNotValidFields] = useState<sendDonatFieldsKeys[]>(
    []
  );

  const { id, username: usernameState } = user;
  const { username, message, amount, selectedBlockchain, is_anonymous } = form;

  const { triggerContract, isLoading, isSuccess } = usePayment({
    form,
    supporterInfo: user,
    creatorInfo: personInfo || initUser,
    usdtKoef,
    balance,
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
    [username, formHandler]
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
    () => notValidFields.includes("amount"),
    [notValidFields]
  );

  useEffect(() => {
    id && setForm((prev) => ({ ...prev, username: usernameState }));
  }, [id, usernameState]);

  useEffect(() => {
    const initPage = async () => {
      const res = await checkWallet();
      if (!res) {
        if (walletConf.isInstall()) {
          const isUnlockedWallet = await walletConf.requestAccounts();
          if (isUnlockedWallet) await checkWallet();
        } else {
          setIsOpenErrorModal(true);
          setLoadingPage(false);
        }
      }
    };

    initPage();
  }, [walletConf]);

  useEffect(() => {
    walletConf.getBalance(setBalance);
  }, [walletConf, blockchain]);

  if (!personInfo) {
    isError && addNotFoundUserNotification();
    return null;
  }

  const { donat_page, avatar } = personInfo;
  const {
    background_banner,
    header_banner,
    background_color,
    main_color,
    welcome_text,
    btn_text,
  } = donat_page;

  if (isOpenErrorModal)
    return (
      <ErrorModalComponent
        open={true}
        centered={true}
        message={`
          It seems that you don't have a Metamask wallet in your browser. To download it <a
              href="${walletConf.main_contract.linkInstall}"
              target="_blank"
              rel="noreferrer"
          >
            click here
          </a>!`}
      />
    );

  if (!blockchain)
    return (
      <div className="loader-page">
        <Loader size="big" />
      </div>
    );

  return (
    <div
      className="donat-wrapper"
      style={{
        backgroundColor: background_color,
        backgroundImage: `url(${background_banner})`,
      }}
    >
      <HeaderComponent
        logoUrl={id ? `/${RoutePaths.admin}/${RoutePaths.donations}` : "/"}
        modificator="headerBlock"
        contentModificator="headerBlock-content"
        visibleLogo
      >
        <WalletBlock modificator="donut-wallet" />
      </HeaderComponent>
      <div className="donat-container">
        <div className="info">
          <div className="background">
            <img src={header_banner || SpaceImg} alt="banner" />
          </div>

          <div className="information-wrapper">
            <div className="main-info">
              <div className="picture">
                <img src={avatar || dummyImg} alt="avatar" />
              </div>
              <div className="personal">
                <span className="title">{welcome_text}</span>
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
                        Boolean(usernameState) || loadingPage || isLoading
                      }
                      modificator={clsx("inputs-name", {
                        isNotValid: notValidFields.includes("username"),
                      })}
                      addonsModificator="inputs-addon"
                      placeholder="Your username"
                      addonAfter={
                        <div className="username-switch">
                          <SwitchForm
                            label={!isMobile ? "Turn on to be anonymous" : ""}
                            checked={is_anonymous}
                            setValue={(flag) =>
                              setForm({ ...form, is_anonymous: flag })
                            }
                            labelModificator="switch-label"
                            maxWidth={250}
                            labelCol={18}
                            switchCol={6}
                            gutter={[0, 18]}
                            tooltipTitle="Turn on to be anonymous"
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
                      placeholder={`Message to ${personInfo.username}`}
                      maxLength={maxLengthDescription}
                      disabled={loadingPage || isLoading}
                      isVisibleLength
                      isTextarea
                    />
                  </div>
                  <AmountInput
                    form={form}
                    color={main_color}
                    usdtKoef={usdtKoef}
                    isNotValid={isNotValidAmountField}
                    formHandler={formHandler}
                    setUsdtKoef={setUsdtKoef}
                  />
                </div>

                <Goals personInfo={personInfo} form={form} setForm={setForm} />

                <div className="bottom">
                  <BaseButton
                    title={btn_text || "Donate"}
                    onClick={sendBtnHandler}
                    padding="10px 25px"
                    fontSize="21px"
                    color={main_color}
                    disabled={loadingPage || isLoading}
                    isMain
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <LoadingModalComponent
          open={!notValidFields.length && (loadingPage || isLoading)}
          message="Please don't close this window untill donation confirmation"
          centered
        />
        <SuccessModalComponent
          open={isSuccess}
          onClose={closeSuccessPopup}
          message={`You've successfully sent ${amount} ${selectedBlockchain} to ${name}`}
          description="Check your donation history in «Donations» section"
        />
      </div>
    </div>
  );
};

export default DonatContainer;
