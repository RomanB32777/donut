import { useEffect, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";

import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router";
import axiosClient, { baseURL } from "../../axiosClient";
import BlueButton from "../../commonComponents/BlueButton";
import PageTitle from "../../commonComponents/PageTitle";
import ContentCard from "../../components/ContentCard";
import { url } from "../../consts";
import { InfoIcon, LargeImageIcon, StarIcon } from "../../icons/icons";
import routes from "../../routes";
import SpaceImg from "../../space.png";
import TestImg from "../../assets/4.jpg";
import "./styles.sass";

import {
  openAuthMetamaskModal,
  openAuthTronModal,
} from "../../store/types/Modal";
import getTronWallet, {
  getMetamaskWallet,
  metamaskWalletIsIntall,
  tronWalletIsIntall,
} from "../../functions/getTronWallet";
import { tryToGetPersonInfo } from "../../store/types/PersonInfo";
import SupportModal from "../../components/SupportModal";
import ChooseWalletModal from "../../components/ChooseWalletModal";
import { setMainWallet } from "../../store/types/Wallet";
import { checkIsExistUser } from "../../utils";
import { tryToGetUser } from "../../store/types/User";
import FormInput from "../../components/FormInput";
import SelectComponent from "../../components/SelectComponent";
import { Col, Radio, RadioChangeEvent, Row, Space } from "antd";
import BaseButton from "../../commonComponents/BaseButton";
import clsx from "clsx";
import { getGoals } from "../../store/types/Goals";
import { IGoalData } from "../../types";

const maxlength = 120;

interface IDonatForm {
  message: string;
  username: string;
  amount: string;
  selectedGoal: string;
}

const DonatContainer = () => {
  const dispatch = useDispatch();
  const { name } = useParams();
  const user = useSelector((state: any) => state.user);
  const personInfo = useSelector((state: any) => state.personInfo).main_info;
  const goals = useSelector((state: any) => state.goals);
  const mainWallet = useSelector((state: any) => state.wallet);

  const [usdtKoef, setUsdtKoef] = useState(0);
  const [isOpenSelectGoal, setIsOpenSelectGoal] = useState<boolean>(true);

  const [form, setForm] = useState<IDonatForm>({
    message: "",
    username: "",
    amount: "0",
    selectedGoal: "0",
  });

  const getUsdKoef = async (currency: string) => {
    const res: any = await axiosClient.get(
      `https://www.binance.com/api/v3/ticker/price?symbol=${currency}USDT`
    );
    setUsdtKoef(res.data.price);
  };

  const onChange = (e: RadioChangeEvent) => {
    console.log("radio checked", e.target.value);
    setForm({
      ...form,
      selectedGoal: e.target.value,
    });
    // setValue(e.target.value);
  };

  useEffect(() => {
    getUsdKoef("MATIC");
    const checkUser = async () => {
      if (mainWallet.token) {
        const isExist = await checkIsExistUser(mainWallet.token);

        if (isExist) {
          dispatch(tryToGetUser(mainWallet.token));
        }
      }
      !Object.keys(user) && dispatch(setMainWallet({}));
      dispatch(
        tryToGetPersonInfo({
          username: name,
        })
      );
    };

    // checkUser()
    !Object.keys(user) && dispatch(setMainWallet({}));
    dispatch(
      tryToGetPersonInfo({
        username: name,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(getGoals(personInfo.user_id));
  }, [personInfo]);

  const isNotRegisterWallet = useMemo(
    () => !metamaskWalletIsIntall() && !tronWalletIsIntall(),
    []
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
              // personInfo.backgroundlink
              //   ? `${url + personInfo.backgroundlink}`
              //   :
              SpaceImg
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
                      TestImg
                      // personInfo.avatarlink && `${url + personInfo.avatarlink}`
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
                    setValue={(username) => {
                      if (username.length === 0) {
                        setForm({
                          ...form,
                          username: "@" + username,
                        });
                      } else
                        setForm({
                          ...form,
                          username,
                        });
                    }}
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
                        title="MATIC"
                        list={["MATIC"]}
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
                      }}
                    >
                      <StarIcon />
                      <p>Participate in goal achievement</p>
                    </div>
                  </Col>
                  {isOpenSelectGoal && (
                    <Col span={17}>
                      <div className="donat-container__payment_goals_list">
                        <Radio.Group onChange={onChange} value={selectedGoal}>
                          <Space direction="vertical">
                            <Radio value={0}>Don’t participate</Radio>
                            {goals.length &&
                              goals
                                .filter((goal: IGoalData) => !goal.isArchive)
                                .map((goal: IGoalData) => (
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
              <BaseButton
                title={personInfo.btn_text || "Donate"}
                onClick={() => console.log()}
                padding="10px 25px"
                fontSize="21px"
                isBlue
              />
              {/* <SupportModal
                additionalFields={form}
                setForm={setForm}
                notTitle
                modificator="donat-page"
              /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonatContainer;
