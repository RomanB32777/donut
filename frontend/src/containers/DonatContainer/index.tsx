import { useContext, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import clsx from "clsx";

import axiosClient from "../../axiosClient";
import { abi_transfer, contractMetaAddress, url } from "../../consts";
import { StarIcon } from "../../icons/icons";
import SpaceImg from "../../space.png";

import {
  getMetamaskData,
  getMetamaskWallet,
  metamaskWalletIsIntall,
  tronWalletIsIntall,
} from "../../functions/getTronWallet";
import { tryToGetPersonInfo } from "../../store/types/PersonInfo";
import { setMainWallet } from "../../store/types/Wallet";
import {
  addNotification,
  addSuccessNotification,
  getUsdKoef,
  installWalletNotification,
} from "../../utils";
import { tryToGetUser } from "../../store/types/User";
import FormInput from "../../components/FormInput";
import SelectComponent from "../../components/SelectComponent";
import { Col, Radio, RadioChangeEvent, Row, Space } from "antd";
import BaseButton from "../../commonComponents/BaseButton";
import { getGoals } from "../../store/types/Goals";
import { IGoalData } from "../../types";
import { WebSocketContext } from "../../components/Websocket/WebSocket";

import "./styles.sass";
import { ethers } from "ethers";
import Loader from "../../components/Loader";

const maxlength = 120;

interface IDonatForm {
  message: string;
  username: string;
  amount: string;
  selectedGoal: string;
}

const initObj: IDonatForm = {
  message: "",
  username: "",
  amount: "0",
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
  const [isOpenSelectGoal, setIsOpenSelectGoal] = useState<boolean>(true);

  const socket = useContext(WebSocketContext);

  const [form, setForm] = useState<IDonatForm>({
    ...initObj,
  });

  const [loading, setLoading] = useState<boolean>(false);

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

  const sendDonation = async () => {
    // setLoading(true);
    let newUser: any = {};
    if (!user.id) {
      newUser = await registerSupporter();
    }
    const { data, status } = await axiosClient.post("/api/donation/create/", {
      creator_token: personInfo.metamask_token,
      backer_token: user.metamask_token || newUser.metamask_token,
      sum: +amount,
      wallet: "metamask",
      donation_message: message,
      goal_id: selectedGoal !== "0" ? selectedGoal : null,
    });

    if (status === 200) {
      socket &&
        user &&
        data.donation &&
        socket.emit("new_donat", {
          supporter: {
            username: user.username || newUser.username,
            id: user.user_id || newUser.user_id,
          },
          wallet: "metamask",
          creator_id: data.donation.creator_id,
          creator_username: data.donation.creator_username,
          sum: amount,
          donationID: data.donation.id,
        });
      selectedGoal !== "0" &&
        (await axiosClient.put("/api/user/goals-widget/", {
          goalData: {
            donat: +amount * usdtKoef,
          },
          creator_id: data.donation.creator_id,
          id: selectedGoal,
        }));
      addSuccessNotification(
        `You’ve successfully sent ${amount} tEVMOS to ${data.donation.creator_username}`
      );
      navigate("/donations");
      setForm({
        ...initObj,
        username,
      });
    }
  };

  const triggerContract = async () => {
    if (metamaskWalletIsIntall()) {
      try {
        setLoading(true);
        const metamaskData = await getMetamaskData();
        if (metamaskData) {
          const { amount } = form;
          const { signer } = metamaskData;
          const smartContract = new ethers.Contract(
            contractMetaAddress,
            abi_transfer,
            signer
          );
          const tx = await smartContract.transferMoney(
            personInfo.metamask_token,
            { value: ethers.utils.parseEther(amount) }
          );
          await tx.wait();
          await sendDonation();
        }
      } catch (error) {
        console.log("error", error);
        addNotification({
          type: "danger",
          title: "Error",
          message: `An error occurred while sending data`,
        });
      } finally {
        setLoading(false);
      }
    } else {
      installWalletNotification(
        "Metamask",
        "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
      );
    }
  };

  useEffect(() => {
    getUsdKoef("evmos", setUsdtKoef);
    dispatch(
      tryToGetPersonInfo({
        username: name,
      })
    );
  }, [name]);

  useEffect(() => {
    const setUser = async () => {
      if (user.id) setForm({ ...form, username: user.username });
      else {
        const walletData = await getMetamaskData();
        if (walletData) {
          const wallet = {
            wallet: "metamask",
            token: walletData.address,
          };
          dispatch(setMainWallet(wallet));
        }
      }
    };
    setUser();
  }, [user]);

  useEffect(() => {
    personInfo.user_id && dispatch(getGoals(personInfo.user_id));
  }, [personInfo]);

  // const isNotRegisterWallet = useMemo(
  //   () => !metamaskWalletIsIntall() && !tronWalletIsIntall(),
  //   []
  // );

  const goalsActive = useMemo(
    () =>
      Array.isArray(goals) &&
      goals.length &&
      goals.filter((goal: IGoalData) => !goal.isarchive),
    [goals]
  );

  const { username, message, amount, selectedGoal } = form;

  return (
    <div
      className="donat-container"
      style={{
        background: personInfo.background_color,
      }}
    >
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
                      personInfo.avatarlink && `${url + personInfo.avatarlink}`
                    }
                    alt="avatar"
                  />
                ) : (
                  <div className="icon" />
                )}
              </div>
              <div className="donat-main-info__personal">
                <span className="title">{personInfo.welcome_text}</span>
                {/* <span className="subtitle">{personInfo.username}</span> */}
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
                    maxLength={maxlength}
                    descriptionInput={`Number of input characters - ${message.length} /
                    ${maxlength}`}
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
                        title="tEVMOS"
                        list={["tEVMOS"]}
                        selectItem={(selected) => console.log(selected)}
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
                    <Col span={6}>
                      <div
                        className={clsx("donat-container__payment_goals_btn", {
                          active: isOpenSelectGoal,
                        })}
                        onClick={() => setIsOpenSelectGoal(!isOpenSelectGoal)}
                        style={{
                          background: personInfo.main_color,
                          // borderColor: personInfo.main_color,
                        }}
                      >
                        <StarIcon />
                        <p>Participate in goal achievement</p>
                      </div>
                    </Col>
                    {isOpenSelectGoal && (
                      <Col span={17}>
                        <div className="donat-container__payment_goals_list">
                          <Radio.Group
                            onChange={onChangeRadio}
                            value={selectedGoal}
                          >
                            <Space direction="vertical">
                              <Radio value={"0"}>Don’t participate</Radio>
                              {goalsActive &&
                                goalsActive.map((goal: IGoalData) => (
                                  <Radio key={goal.id} value={goal.id}>
                                    {goal.title}
                                  </Radio>
                                ))}
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
                  isBlue
                />
                {loading && (
                  <div
                    style={{
                      marginLeft: 10,
                    }}
                  >
                    <Loader size="small" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonatContainer;
