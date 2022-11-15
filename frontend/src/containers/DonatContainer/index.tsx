import { useContext, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import clsx from "clsx";

import axiosClient from "../../axiosClient";
import { Col, Radio, RadioChangeEvent, Row, Space } from "antd";
import { Socket } from "socket.io-client";

import { tryToGetPersonInfo } from "../../store/types/PersonInfo";
import { setMainWallet } from "../../store/types/Wallet";
import {
  addNotFoundUserNotification,
  addNotification,
  copyStr,
  getUsdKoef,
} from "../../utils";
import FormInput from "../../components/FormInput";
import SelectComponent from "../../components/SelectComponent";
import BaseButton from "../../components/BaseButton";
import { connectSocket, WebSocketContext } from "../../components/Websocket";
import {
  LoadingModalComponent,
  SuccessModalComponent,
} from "../../components/ModalComponent";
import { HeaderComponent } from "../../components/HeaderComponents/HeaderComponent";
import { getGoals } from "../../store/types/Goals";
import { tryToGetUser } from "../../store/types/User";
import { StarIcon } from "../../icons/icons";
import { IGoalData } from "../../types";
import { walletsConf, currBlockchain } from "../../utils";

import SpaceImg from "../../space.png";
import { url } from "../../consts";
import "./styles.sass";

const maxLengthDescription = 150;

interface IDonatForm {
  message: string;
  username: string;
  amount: string;
  selectedBlockchain: string;
  selectedGoal: string;
}

const initObj: IDonatForm = {
  message: "",
  username: "",
  amount: "",
  selectedBlockchain: "",
  selectedGoal: "0",
};

const DonatContainer = () => {
  const dispatch = useDispatch();
  const { name } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.user);
  const personInfo = useSelector((state: any) => state.personInfo).main_info;
  const goals = useSelector((state: any) => state.goals);
  const mainWallet = useSelector((state: any) => state.wallet);

  const [usdtKoef, setUsdtKoef] = useState(0);
  const [balance, setBalance] = useState(0);
  const [isOpenSelectGoal, setIsOpenSelectGoal] = useState<boolean>(true);

  const socket = useContext(WebSocketContext);

  const [form, setForm] = useState<IDonatForm>({
    ...initObj,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [isOpenSuccessModal, setIsOpenSuccessModal] = useState<boolean>(false);

  const onChangeRadio = (e: RadioChangeEvent) => {
    setForm({
      ...form,
      selectedGoal: e.target.value,
    });
  };

  const registerSupporter = async () => {
    const { data } = await axiosClient.post("/api/user/check-username", {
      username,
    });
    if (data.error) {
      console.log(data.error);
      return;
    } else {
      const { data, status } =
        mainWallet.token &&
        (await axiosClient.post("/api/user/create-user", {
          role: "backers",
          username: username,
          token: mainWallet.token,
          typeWallet: mainWallet.wallet || "metamask",
        }));

      if (status === 200) {
        const newUser = data.newUser;
        dispatch(tryToGetUser(mainWallet.token));
        return newUser;
      }
    }
    return;
  };

  const closeSuccessPopup = () => {
    setIsOpenSuccessModal(false);
    setForm({
      ...initObj,
      username,
    });
    navigate("/donations");
  };

  const sendDonation = async () => {
    const { selectedBlockchain } = form;
    let newUser: any = {};
    let newSocket: Socket | null = null;

    if (!user.id) {
      newUser = await registerSupporter();
      newSocket = connectSocket(newUser.username, dispatch);
    }
    const tokenField = `${process.env.REACT_APP_WALLET}_token`;

    if (tokenField && selectedBlockchain) {
      const { data } = await axiosClient.post("/api/donation/create/", {
        creator_token: personInfo[tokenField],
        backer_token: user[tokenField] || newUser[tokenField],
        sum: +amount,
        wallet: process.env.REACT_APP_WALLET || "metamask",
        blockchain: selectedBlockchain, // "tEVMOS"
        donation_message: message,
        goal_id: selectedGoal !== "0" ? selectedGoal : null,
      });

      if (data.donation && (user || newUser)) {
        const emitObj = {
          supporter: {
            username: user.username || newUser.username,
            id: user.user_id || newUser.id,
          },
          wallet: process.env.REACT_APP_WALLET || "metamask",
          blockchain: selectedBlockchain, // "tEVMOS"
          creator_id: data.donation.creator_id,
          creator_username: personInfo.username,
          sum: amount,
          donationID: data.donation.id,
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

        setIsOpenSuccessModal(true);
      }
    }
  };

  const triggerContract = async () => {
    const { amount, username } = form;
    if (Boolean(+amount) && username.length) {
      try {
        const wallet = walletsConf[process.env.REACT_APP_WALLET || "metamask"];

        const walletData = await wallet.getWalletData(
          process.env.REACT_APP_BLOCKCHAIN
        ); // await getMetamaskData();

        if (walletData && walletData.address) {
          const { signer, address } = walletData;

          const tokenField = `${process.env.REACT_APP_WALLET}_token`;

          if (address !== personInfo[tokenField]) {
            setLoading(true);

            if (balance >= Number(amount)) {
              const currentBlockchain = wallet.blockchains.find(
                (b) => b.name === process.env.REACT_APP_BLOCKCHAIN
              );

              if (currentBlockchain) {
                const res = await wallet.paymentMethod({
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
    dispatch(
      tryToGetPersonInfo({
        username: name,
      })
    );
  }, [name]);

  useEffect(() => {
    getUsdKoef(process.env.REACT_APP_BLOCKCHAIN || "evmos", setUsdtKoef);
  }, []); // form

  useEffect(() => {
    const setUser = async () => {
      if (user.id) setForm({ ...form, username: user.username });
      else {
        const wallet = walletsConf[process.env.REACT_APP_WALLET || "metamask"];
        const walletData = await wallet.getWalletData(
          process.env.REACT_APP_BLOCKCHAIN
        );

        if (walletData) {
          await wallet.getBalance({
            walletData,
            setBalance,
          });

          dispatch(
            setMainWallet({
              token: walletData.address,
              wallet: process.env.REACT_APP_WALLET || "metamask",
              blockchain: process.env.REACT_APP_BLOCKCHAIN,
            })
          );
        }
      }
    };
    setUser();
  }, [user]);

  useEffect(() => {
    personInfo.user_id && dispatch(getGoals(personInfo.user_id));
    personInfo.error && addNotFoundUserNotification();
  }, [personInfo]);

  // const isNotRegisterWallet = useMemo(
  //   () => !metamaskWalletIsIntall() && !tronWalletIsIntall(),
  //   []
  // );

  const blockchainList = useMemo(() => {
    if (currBlockchain) {
      setForm({
        ...initObj,
        selectedBlockchain: currBlockchain.nativeCurrency.symbol,
      });
      return currBlockchain.nativeCurrency.symbol;
    }
    return "";
  }, []);

  const goalsActive = useMemo(
    () =>
      Array.isArray(goals) &&
      goals.length &&
      goals.filter((goal: IGoalData) => !goal.isarchive),
    [goals]
  );

  const { username, message, amount, selectedBlockchain, selectedGoal } = form;

  if (personInfo.error) return null;

  return (
    <>
      {/* <HeaderBanner /> */}
      <div
        className="donat-container"
        style={{
          background: personInfo.background_color,
        }}
      >
        <HeaderComponent
          handlerHeaderSelect={() => {
            user.username ? navigate("/settings") : copyStr(mainWallet.token);
          }}
          modificator="donat-header"
          logoUrl={user.id ? "/donations" : "/"}
          backgroundColor={personInfo.background_color}
          visibleLogo
        />
        <div className="donat-info-container">
          <div className="donat-info-container__background">
            <img
              src={
                personInfo.backgroundlink
                  ? `${url + personInfo.backgroundlink}`
                  : SpaceImg
              }
              alt="banner"
            />
          </div>

          <div className="donat-info-container__information-wrapper">
            <div className="donat-info-container__information-wrapper__information">
              <div className="donat-main-info">
                <div className="donat-main-info__picture">
                  {personInfo.avatarlink && personInfo.avatarlink.length > 0 ? (
                    <img
                      src={
                        personInfo.avatarlink &&
                        `${url + personInfo.avatarlink}`
                      }
                      alt="avatar"
                    />
                  ) : (
                    <div className="icon" />
                  )}
                </div>
                <div className="donat-main-info__personal">
                  <span className="title">{personInfo.welcome_text}</span>
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
                      disabled={Boolean(user.username)}
                      modificator="donat-container__payment_inputs-name"
                      placeholder="Your username"
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
                      placeholder="Type your message here..."
                      maxLength={maxLengthDescription}
                      descriptionInput={`Number of input characters - ${message.length} /
                    ${maxLengthDescription}`}
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
                      typeInput="number"
                      addonAfter={
                        <SelectComponent
                          title={blockchainList}
                          list={[blockchainList]}
                          selectItem={(selected) =>
                            setForm({
                              ...form,
                              selectedBlockchain: selected,
                            })
                          }
                          modificator="donat-container__payment_inputs-select"
                        />
                      }
                      modificator="donat-container__payment_inputs-amount"
                      placeholder="Donation amount"
                      descriptionInput={`Equal to ${parseFloat(
                        String(+amount * usdtKoef)
                      ).toFixed(2)} USD`}
                    />
                  </div>
                </div>
                {Array.isArray(goalsActive) && Boolean(goalsActive.length) && (
                  <div className="donat-container__payment_goals">
                    <Row justify="space-between">
                      <Col md={8} xs={12}>
                        <div
                          className={clsx(
                            "donat-container__payment_goals_btn",
                            {
                              active: isOpenSelectGoal,
                            }
                          )}
                          onClick={() => setIsOpenSelectGoal(!isOpenSelectGoal)}
                          style={{
                            background: personInfo.main_color,
                          }}
                        >
                          <StarIcon />
                          <p>Participate in goal achievement</p>
                        </div>
                      </Col>
                      {isOpenSelectGoal && (
                        <Col md={15} xs={11}>
                          <div className="donat-container__payment_goals_list">
                            <Radio.Group
                              onChange={onChangeRadio}
                              value={selectedGoal}
                            >
                              <Space direction="vertical">
                                <Radio value={"0"}>Don’t participate</Radio>
                                {goalsActive &&
                                  goalsActive.map(
                                    ({
                                      id,
                                      title,
                                      amount_raised,
                                      amount_goal,
                                    }: IGoalData) => (
                                      <Radio key={id} value={id}>
                                        {title} ({amount_raised}/{amount_goal}{" "}
                                        USD)
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
                    title={personInfo.btn_text || "Donate"}
                    onClick={triggerContract}
                    padding="10px 25px"
                    fontSize="21px"
                    color={personInfo.main_color}
                    disabled={loading}
                  />
                  <div className="donat-container__payment_balance">
                    Your balance: {(balance * usdtKoef).toFixed(2)} USD
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <LoadingModalComponent
          open={loading}
          message="Please don’t close this window untill donation confirmation"
        />
        <SuccessModalComponent
          open={isOpenSuccessModal}
          onClose={closeSuccessPopup}
          message={`You’ve successfully sent ${amount} ${selectedBlockchain} to ${name}`}
        />
      </div>
    </>
  );
};

export default DonatContainer;
