import { useContext, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { ISendDonat } from "types";

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
  LoadingModalComponent,
  SuccessModalComponent,
} from "components/ModalComponent";
import { HeaderComponent } from "components/HeaderComponents/HeaderComponent";
import SwitchForm from "components/SwitchForm";

import { tryToGetPersonInfo } from "store/types/PersonInfo";
import { getGoals } from "store/types/Goals";
import { checkWallet } from "utils";
import { triggerContract } from "./utils";
import { adminPath, dummyImg, initSendDonatData } from "consts";

import SpaceImg from "assets/space.png";
import "./styles.sass";

const maxLengthDescription = 150;

const DonatContainer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { name } = useParams();
  const { user, personInfo, blockchain } = useAppSelector((state) => state);
  const { isMobile } = useWindowDimensions();

  const { walletConf } = useContext(WalletContext);
  const socket = useContext(WebSocketContext);
  // const mainWallet = useAppSelector((state: any) => state.wallet);
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
  const [form, setForm] = useState<ISendDonat>({
    ...initSendDonatData,
  });
  const [loadingPage, setLoadingPage] = useState<boolean>(false);
  const [isOpenSuccessModal, setIsOpenSuccessModal] = useState<boolean>(false);

  const { username, message, amount, selectedBlockchain, is_anonymous } = form;

  const closeSuccessPopup = () => {
    setIsOpenSuccessModal(false);
    setForm({
      ...initSendDonatData,
      username,
    });
    navigate(`/${adminPath}/donations`);
  };

  const sendBtnHandler = async () =>
    await triggerContract({
      form,
      user,
      socket,
      usdtKoef,
      balance,
      personInfo,
      walletConf,
      dispatch,
      setLoading: setLoadingPage,
      setIsOpenSuccessModal,
    });

  const isValidateForm = useMemo(
    () =>
      Object.keys(form)
        .filter((key) => !["selectedGoal", "is_anonymous"].includes(key))
        .every((val) => Boolean(val)),
    [form]
  );

  useEffect(() => {
    name && dispatch(tryToGetPersonInfo(name));
  }, [name]);

  useEffect(() => {
    const setUser = async () => {
      const blockchainData = await walletConf.getBlockchainData();

      if (blockchainData) {
        await walletConf.getBalance(setBalance);
        user.id && setForm((prev) => ({ ...prev, username: user.username }));
      }
    };
    setUser();
  }, [walletConf, user]);

  useEffect(() => {
    checkWallet({ walletConf, dispatch, navigate });
  }, [walletConf]);

  useEffect(() => {
    console.log(blockchain);
  }, [blockchain]);

  useEffect(() => {
    personInfo.id && dispatch(getGoals(personInfo.id));
  }, [personInfo]);

  if (!personInfo.id) return null;

  if (!blockchain)
    return (
      <div className="loader-page">
        <Loader size="big" />
      </div>
    );

  return (
    <div
      className="donat-wrapper"
      style={{ backgroundImage: `url(${background_banner})` }}
    >
      <HeaderComponent
        logoUrl={user.id ? `/${adminPath}/donations` : `/${adminPath}`}
        backgroundColor={background_color}
        modificator="headerBlock"
        contentModificator="headerBlock-content"
        visibleLogo
      >
        <WalletBlock modificator="donut-wallet" />
      </HeaderComponent>
      <div
        className="donat-container"
        style={{
          background: background_color,
        }}
      >
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
                      setValue={(value) => {
                        if (username.length === 0) {
                          setForm({
                            ...form,
                            username: "@" + value,
                          });
                        } else if (
                          value.length < username.length &&
                          value.length === 2
                        ) {
                          setForm({
                            ...form,
                            username: "",
                          });
                        } else {
                          setForm({
                            ...form,
                            username: value,
                          });
                        }
                      }}
                      disabled={Boolean(user.username) || loadingPage}
                      modificator="inputs-name"
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
                    usdtKoef={usdtKoef}
                    setForm={setForm}
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
          open={isValidateForm && loadingPage}
          message="Please don’t close this window untill donation confirmation"
          centered
        />
        <SuccessModalComponent
          open={isOpenSuccessModal}
          onClose={closeSuccessPopup}
          message={`You’ve successfully sent ${amount} ${selectedBlockchain} to ${name}`}
        />
      </div>
    </div>
  );
};

export default DonatContainer;
