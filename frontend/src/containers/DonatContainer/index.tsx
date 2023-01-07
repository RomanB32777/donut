import { useContext, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router";
import clsx from "clsx";
import { IGoalData, IShortUserData } from "types";

import axiosClient from "../../modules/axiosClient";
import { Col, Radio, RadioChangeEvent, Row, Space } from "antd";
import { Socket } from "socket.io-client";

import { useAppSelector } from "hooks/reduxHooks";
import { tryToGetPersonInfo } from "../../store/types/PersonInfo";
import { setSelectedBlockchain } from "../../store/types/Wallet";
import { addNotification, getUsdKoef } from "../../utils";
import WalletBlock from "../../components/HeaderComponents/WalletBlock";
import FormInput from "../../components/FormInput";
import SelectComponent from "../../components/SelectComponent";
import BaseButton from "../../components/BaseButton";
import Loader from "../../components/Loader";
import { WalletContext } from "../../contexts/Wallet";
import { connectSocket, WebSocketContext } from "../../components/Websocket";
import {
  LoadingModalComponent,
  SuccessModalComponent,
} from "../../components/ModalComponent";
import { HeaderComponent } from "../../components/HeaderComponents/HeaderComponent";
import SwitchForm from "../../components/SwitchForm";
import { TabsComponent } from "../../components/TabsComponent";
import { getNotifications } from "../../store/types/Notifications";
import { getGoals } from "../../store/types/Goals";
import { tryToGetUser } from "../../store/types/User";
import { StarIcon } from "../../icons";
import { INewDonatSocketObj } from "types";

import { adminPath } from "../../consts";
import SpaceImg from "../../space.png";
import "./styles.sass";

const maxLengthDescription = 150;

interface IDonatForm {
  message: string;
  username: string;
  amount: string;
  selectedBlockchain: string;
  selectedGoal: string;
  isAnonymous: boolean;
}

const initObj: IDonatForm = {
  message: "",
  username: "",
  amount: "",
  selectedBlockchain: "",
  selectedGoal: "0",
  isAnonymous: true,
};

const tabCountTypes = [5, 10, 15];

const DonatContainer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { name } = useParams();
  const { user, personInfo, goals } = useAppSelector((state) => state);
  // const mainWallet = useSelector((state: any) => state.wallet);
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
  const [isOpenSelectGoal, setIsOpenSelectGoal] = useState<boolean>(true);
  const [tabCount, setTabCount] = useState(""); // String(tabCountTypes[0])

  const { walletConf } = useContext(WalletContext);
  const socket = useContext(WebSocketContext);

  const [form, setForm] = useState<IDonatForm>({
    ...initObj,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [isOpenSuccessModal, setIsOpenSuccessModal] = useState<boolean>(false);

  const {
    username,
    message,
    amount,
    selectedBlockchain,
    selectedGoal,
    isAnonymous,
  } = form;

  const onChangeRadio = (e: RadioChangeEvent) => {
    setForm({
      ...form,
      selectedGoal: e.target.value,
    });
  };

  const closeSuccessPopup = () => {
    setIsOpenSuccessModal(false);
    setForm({
      ...initObj,
      username,
    });
    navigate(`/${adminPath}/donations`);
  };

  const registerSupporter = async (): Promise<any> => {
    const { data } = await axiosClient.get(
      `/api/user/check-username/${username}`
    );
    if (data.error) {
      console.log(data.error);
      return null;
    } else {
      const blockchainData = await walletConf.getBlockchainData();
      if (blockchainData) {
        const { address } = blockchainData;
        const { data, status } = await axiosClient.post("/api/user/", {
          username,
          roleplay: "backers",
          wallet_address: address,
        } as IShortUserData);

        if (status === 200) {
          dispatch(tryToGetUser(address));
          return data;
        }
      }
      return null;
    }
  };

  const sendDonation = async () => {
    const { selectedBlockchain } = form;
    let newUser: any = {};
    let newSocket: Socket | null = null;

    if (!user.id) {
      newUser = await registerSupporter();
      newSocket = connectSocket(newUser.username, dispatch);
    }
    const tokenField = "wallet_address";

    if (tokenField && selectedBlockchain) {
      const { data } = await axiosClient.post("/api/donation/", {
        creator_token: personInfo[tokenField],
        backer_token: user[tokenField] || newUser[tokenField],
        sum: +amount,
        wallet: process.env.REACT_APP_WALLET || "metamask",
        blockchain: selectedBlockchain, // "tEVMOS"
        donation_message: message,
        goal_id: selectedGoal !== "0" ? selectedGoal : null,
      });

      if (data.donation && (user || newUser)) {
        const emitObj: INewDonatSocketObj = {
          supporter: {
            username: user.username || newUser.username,
            id: user.id || newUser.id,
          },
          creator: {
            username: personInfo.username,
            id: data.donation.creator_id,
          },
          blockchain: selectedBlockchain, // "tEVMOS"
          sum: +amount,
          donation_id: data.donation.id,
        };

        if (socket) {
          socket.emit("new_donat", emitObj);
        } else if (newSocket) {
          newSocket.emit("new_donat", emitObj);
        } else {
          console.log("not connected user");
        }

        selectedGoal !== "0" &&
          (await axiosClient.put("/api/widget/goals-widget/", {
            goalData: {
              donat: +amount * usdtKoef,
            },
            creator_id: data.donation.creator_id,
            id: selectedGoal,
          }));

        dispatch(getNotifications({ user: user.username || newUser.username }));
        setIsOpenSuccessModal(true);
      }
    }
  };

  const triggerContract = async () => {
    const { amount, username } = form;
    if (Boolean(+amount) && username.length) {
      try {
        const blockchainData = await walletConf.getBlockchainData();

        if (blockchainData && blockchainData.address) {
          const { signer, address } = blockchainData;

          const tokenField = "wallet_address";

          if (address !== personInfo[tokenField]) {
            setLoading(true);

            if (balance >= Number(amount)) {
              const currentBlockchain = walletConf.blockchains.find(
                (b) => b.name === process.env.REACT_APP_BLOCKCHAIN
              );

              if (currentBlockchain) {
                const res = await walletConf.paymentMethod({
                  contract: currentBlockchain.address,
                  addressTo: personInfo[tokenField],
                  sum: amount,
                  signer,
                });

                res && (await sendDonation());
              }
            } else {
              addNotification({
                type: "warning",
                title: "Insufficient balance",
                message:
                  "Unfortunately, there are not enough funds on your balance to carry out the operation",
              });
            }
          } else {
            addNotification({
              type: "warning",
              title: "Seriously ?)",
              message: "You are trying to send a donation to yourself",
            });
          }
        }
      } catch (error) {
        console.log("error", error);
        addNotification({
          type: "danger",
          title: "Error",
          message:
            (error as any)?.response?.data?.message ||
            (error as Error).message ||
            `An error occurred while sending data`,
        });
      } finally {
        setLoading(false);
      }
    } else {
      addNotification({
        type: "warning",
        title: "Not all fields are filled",
      });
    }
  };

  useEffect(() => {
    name && dispatch(tryToGetPersonInfo(name));
  }, [name]);

  useEffect(() => {
    const setUser = async () => {
      setLoading(true);
      const blockchainData = await walletConf.getBlockchainData();

      if (blockchainData) {
        await walletConf.getBalance(setBalance);
        if (user.id) setForm((prev) => ({ ...prev, username: user.username }));
        else {
          // dispatch(
          //   setSelectedBlockchain({
          //     token: blockchainData.address,
          //     blockchain: process.env.REACT_APP_BLOCKCHAIN, // !!!!
          //   })
          // );
        }
      }
      setLoading(false);
    };
    setUser();
  }, [user]);

  useEffect(() => {
    personInfo.id && dispatch(getGoals(personInfo.id));
  }, [personInfo]);

  // const isNotRegisterWallet = useMemo(
  //   () => !metamaskWalletIsIntall() && !tronWalletIsIntall(),
  //   []
  // );

  useEffect(() => {
    const setInitSelectedBlockchain = async () => {
      const currBlockchain = await walletConf.getCurrentBlockchain();
      currBlockchain &&
        setForm({
          ...initObj,
          selectedBlockchain: currBlockchain.nativeCurrency.symbol,
        });
    };

    setInitSelectedBlockchain();
  }, [walletConf]);

  useEffect(() => {
    const setBlockchain = async () => {
      if (selectedBlockchain) {
        const blockchainInfo = walletConf.blockchains.find(
          (b) => b.nativeCurrency.symbol === selectedBlockchain
        );
        if (blockchainInfo) {
          await walletConf.changeBlockchain(blockchainInfo.name);
          dispatch(setSelectedBlockchain(blockchainInfo.name));
          await getUsdKoef(
            blockchainInfo.nativeCurrency.exchangeName,
            setUsdtKoef
          );
        }
      }
    };
    setBlockchain();
  }, [selectedBlockchain]);

  const goalsActive = useMemo(
    () => goals.filter((goal: IGoalData) => !goal.isarchive),
    [goals]
  );

  const isValidateForm = useMemo(
    () => Object.values(form).every((val) => Boolean(val)),
    [form]
  );

  const selectedBlockchainIconInfo = useMemo(() => {
    const info = walletConf.blockchains.find(
      (b) => b.nativeCurrency.symbol === selectedBlockchain
    );
    if (info)
      return {
        icon: info.icon,
        color: info.color,
      };
  }, [selectedBlockchain]);

  const countTabs = useMemo(
    () =>
      tabCountTypes.map((tab) => ({
        key: String(tab),
        label: `${tab} ${selectedBlockchain}`,
      })),
    [selectedBlockchain]
  );

  if (!personInfo.id) return null;

  if (!isValidateForm && loading)
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
      {/* <HeaderBanner /> */}
      <HeaderComponent
        logoUrl={user.id ? `/${adminPath}/donations` : `/${adminPath}`}
        backgroundColor={background_color}
        modificator="donat-header"
        contentModificator="donat-header-content"
        visibleLogo
      >
        <WalletBlock />
      </HeaderComponent>
      <div
        className="donat-container"
        style={{
          background: background_color,
        }}
      >
        <div className="donat-info-container">
          <div className="donat-info-container__background">
            <img src={header_banner || SpaceImg} alt="banner" />
          </div>

          <div className="donat-info-container__information-wrapper">
            <div className="donat-info-container__information-wrapper__information">
              <div className="donat-main-info">
                <div className="donat-main-info__picture">
                  {avatar ? (
                    <img src={avatar} alt="avatar" />
                  ) : (
                    <div className="icon" />
                  )}
                </div>
                <div className="donat-main-info__personal">
                  <span className="title">{welcome_text}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="donat-container__payment_wrapper">
          <div className="donat-container__payment">
            <div className="donat-container__payment-row">
              <div className="donat-container__payment-column">
                <div className="donat-container__payment_inputs">
                  <div className="donat-container__payment_inputs-item">
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
                      disabled={Boolean(user.username) || loading}
                      modificator="donat-container__payment_inputs-name"
                      addonsModificator="input-addon"
                      placeholder="Your username"
                      addonAfter={
                        <div className="username-switch">
                          <SwitchForm
                            label="Turn off to be anonymous"
                            checked={isAnonymous}
                            setValue={(flag) =>
                              setForm({ ...form, isAnonymous: flag })
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
                  <div className="donat-container__payment_inputs-item">
                    <FormInput
                      value={message}
                      setValue={(message) => {
                        setForm({
                          ...form,
                          message,
                        });
                      }}
                      modificator="donat-container__payment_inputs-message"
                      placeholder={`Message to ${username}`}
                      maxLength={maxLengthDescription}
                      disabled={loading}
                      isVisibleLength
                      isTextarea
                    />
                  </div>
                  <div className="donat-container__payment_inputs-item">
                    <FormInput
                      value={amount}
                      setValue={(amount) => {
                        setForm({
                          ...form,
                          amount,
                        });
                      }}
                      // disabled={loading}
                      typeInput="number"
                      addonAfter={
                        <SelectComponent
                          title={
                            <div className="selected-blockchain">
                              {selectedBlockchainIconInfo && (
                                <div
                                  className="blockchain-icon"
                                  style={{
                                    background:
                                      selectedBlockchainIconInfo.color,
                                  }}
                                >
                                  <img
                                    src={selectedBlockchainIconInfo.icon}
                                    alt={selectedBlockchain}
                                  />
                                </div>
                              )}
                              <span>{selectedBlockchain}</span>
                            </div>
                          }
                          list={walletConf.blockchains.map(
                            ({ nativeCurrency }) => nativeCurrency.symbol
                          )}
                          selected={selectedBlockchain}
                          selectItem={(selected) =>
                            setForm({
                              ...form,
                              selectedBlockchain: selected,
                            })
                          }
                          modificator="donat-container__payment_inputs-select"
                        />
                      }
                      addonsModificator="select-blockchain"
                      modificator="donat-container__payment_inputs-amount"
                      placeholder="Donation amount"
                      descriptionInput={
                        <>
                          <TabsComponent
                            setTabContent={(key) => {
                              setTabCount(key);
                              setForm({
                                ...form,
                                amount: key,
                              });
                            }}
                            activeKey={tabCount}
                            tabs={countTabs}
                          />
                          <p className="usd-equal">
                            Equal to&nbsp;
                            {parseFloat(String(+amount * usdtKoef)).toFixed(1)}
                            &nbsp;USD
                          </p>
                        </>
                      }
                      descriptionModificator="count-modificator"
                    />
                  </div>
                </div>
                {Boolean(goalsActive.length) && (
                  <div className="donat-container__payment_goals">
                    <Row justify="space-between">
                      <Col md={9} xs={12}>
                        <div
                          className={clsx(
                            "donat-container__payment_goals_btn",
                            {
                              active: isOpenSelectGoal,
                            }
                          )}
                          onClick={() => setIsOpenSelectGoal(!isOpenSelectGoal)}
                          style={{
                            background: main_color,
                          }}
                        >
                          <div className="header">
                            <StarIcon />
                            <p>Donation goals</p>
                          </div>
                          <p className="description">
                            Help adinross achieve his donation goals
                          </p>
                        </div>
                      </Col>
                      {isOpenSelectGoal && (
                        <Col md={14} xs={11}>
                          <div className="donat-container__payment_goals_list">
                            <Radio.Group
                              onChange={onChangeRadio}
                              value={selectedGoal}
                            >
                              <Space direction="vertical">
                                <Radio className="radio-select" value="0">
                                  Don't participate
                                </Radio>
                                {goalsActive &&
                                  goalsActive.map(
                                    ({
                                      id,
                                      title,
                                      amount_raised,
                                      amount_goal,
                                    }: IGoalData) => (
                                      <Radio
                                        className="radio-select"
                                        key={id}
                                        value={id}
                                      >
                                        {title} ({amount_raised}/{amount_goal}
                                        &nbsp;USD)
                                      </Radio>
                                    )
                                  )}
                              </Space>
                            </Radio.Group>
                          </div>
                        </Col>
                      )}
                    </Row>
                  </div>
                )}
                <div className="donat-container__payment_bottom">
                  <BaseButton
                    title={btn_text || "Send donations"}
                    onClick={triggerContract}
                    padding="10px 25px"
                    fontSize="21px"
                    color={main_color}
                    disabled={loading}
                    isMain
                  />
                  {/* <div className="donat-container__payment_balance">
                    Your balance: {(balance * usdtKoef).toFixed(2)} USD
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <LoadingModalComponent
          open={isValidateForm && loading}
          message="Please don’t close this window untill donation confirmation"
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
