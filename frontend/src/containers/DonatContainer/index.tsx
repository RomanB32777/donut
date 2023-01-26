import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { ISendDonat, requiredFields, sendDonatFieldsKeys } from "types";

import { WalletContext } from "contexts/Wallet";
import { useAppSelector } from "hooks/reduxHooks";
import useWindowDimensions from "hooks/useWindowDimensions";

import { WebSocketContext } from "components/Websocket";
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
import { HeaderComponent } from "components/HeaderComponents/HeaderComponent";
import SwitchForm from "components/SwitchForm";

import { tryToGetPersonInfo } from "store/types/PersonInfo";
import { getGoals } from "store/types/Goals";
import { addNotification, checkWallet } from "utils";
import { triggerContract } from "./utils";
import { adminPath, dummyImg, initSendDonatData } from "consts";
import { IFormHandler } from "./types";

import SpaceImg from "assets/space.png";
import "./styles.sass";
import clsx from "clsx";

const maxLengthDescription = 150;
const requiredFormFields: requiredFields[] = ["amount", "username"];

const DonatContainer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { name } = useParams();
  const { user, personInfo, blockchain } = useAppSelector((state) => state);
  const { isMobile } = useWindowDimensions();

  const walletConf = useContext(WalletContext);
  const socket = useContext(WebSocketContext);
  const { donat_page, avatar } = personInfo;
  const {
    background_banner,
    header_banner,
    background_color,
    main_color,
    welcome_text,
    btn_text,
  } = donat_page;

  const [usdtKoef, setUsdtKoef] = useState(0);
  const [balance, setBalance] = useState(0);
  const [form, setForm] = useState<ISendDonat>(initSendDonatData);
  const [loadingPage, setLoadingPage] = useState(false);
  const [isOpenSuccessModal, setIsOpenSuccessModal] = useState(false);
  const [isOpenErrorModal, setIsOpenErrorModal] = useState(false);
  const [notValidFields, setNotValidFields] = useState<sendDonatFieldsKeys[]>(
    []
  );

  const { id, username: usernameState } = user;
  const { username, message, amount, selectedBlockchain, is_anonymous } = form;

  const checkValidate = () => {
    const keys = Object.keys(form) as sendDonatFieldsKeys[];
    return keys.filter((key) => {
      if (requiredFormFields.includes(key as any)) return !Boolean(form[key]);
      return false;
    });
  };

  const formHandler = ({ field, value }: IFormHandler) => {
    setNotValidFields((prev) => prev.filter((f) => f !== field));
    setForm({
      ...form,
      [field]: value,
    });
  };

  const usernameHandler = (value: string) => {
    if (username.length === 0) {
      setForm({
        ...form,
        username: "@" + value,
      });
    } else if (value.length < username.length && value.length === 2) {
      setForm({
        ...form,
        username: "",
      });
    } else {
      formHandler({ field: "username", value });
      setNotValidFields((prev) => prev.filter((f) => f !== "username"));
      setForm({
        ...form,
        username: value,
      });
    }
  };

  const closeSuccessPopup = () => {
    setIsOpenSuccessModal(false);
    setForm({
      ...initSendDonatData,
      username,
    });
    navigate(`/${adminPath}/donations`);
  };

  const sendBtnHandler = async () => {
    const notValidFields = checkValidate();
    if (notValidFields.length) {
      setNotValidFields(notValidFields);
      addNotification({
        type: "warning",
        title: "Not all fields are filled",
      });
    } else {
      await triggerContract({
        form,
        user,
        socket,
        usdtKoef,
        balance,
        personInfo,
        walletConf,
        userID: id,
        dispatch,
        setLoading: setLoadingPage,
        setIsOpenSuccessModal,
      });
    }
  };

  useEffect(() => {
    name && dispatch(tryToGetPersonInfo(name));
  }, [name]);

  useEffect(() => {
    id && setForm((prev) => ({ ...prev, username: usernameState }));
  }, [id, usernameState]);

  useEffect(() => {
    const initPage = async () => {
      const res = await checkWallet({ walletConf, dispatch });
      if (!res) {
        if (walletConf.isInstall()) {
          const isUnlockedWallet = await walletConf.requestAccounts();
          if (isUnlockedWallet) await checkWallet({ walletConf, dispatch });
        } else {
          setIsOpenErrorModal(true);
          setLoadingPage(false);
        }
      } 
      // else {
      //   const blockchainData = await walletConf.getWalletData();
      //   if (blockchainData) await walletConf.getBalance(setBalance);
      // }
    };

    initPage();
  }, [walletConf]);

  useEffect(() => {
    walletConf.getBalance(setBalance);
  }, [walletConf, blockchain]);

  useEffect(() => {
    personInfo.id && dispatch(getGoals(personInfo.id));
  }, [personInfo]);

  if (!personInfo.id) return null;

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
        logoUrl={id ? `/${adminPath}/donations` : "/"}
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
                      disabled={Boolean(usernameState) || loadingPage}
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
                          />
                        </div>
                      }
                    />
                  </div>
                  <div className="item">
                    <FormInput
                      value={message}
                      setValue={(message) => {
                        setForm({
                          ...form,
                          message,
                        });
                      }}
                      modificator="inputs-message"
                      placeholder={`Message to ${personInfo.username}`}
                      maxLength={maxLengthDescription}
                      disabled={loadingPage}
                      isVisibleLength
                      isTextarea
                    />
                  </div>
                  <AmountInput
                    form={form}
                    color={main_color}
                    usdtKoef={usdtKoef}
                    formHandler={formHandler}
                    isNotValid={notValidFields.includes("amount")}
                    setUsdtKoef={setUsdtKoef}
                  />
                </div>

                <Goals form={form} setForm={setForm} />

                <div className="bottom">
                  <BaseButton
                    title={btn_text || "Donate"}
                    onClick={sendBtnHandler}
                    padding="10px 25px"
                    fontSize="21px"
                    color={main_color}
                    disabled={loadingPage}
                    isMain
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <LoadingModalComponent
          open={!notValidFields.length && loadingPage}
          message="Please don’t close this window untill donation confirmation"
          centered
        />
        <SuccessModalComponent
          open={isOpenSuccessModal}
          onClose={closeSuccessPopup}
          message={`You've successfully sent ${amount} ${selectedBlockchain} to ${name}`}
          description="Check your donation history in «Donations» section"
        />
      </div>
    </div>
  );
};

export default DonatContainer;
