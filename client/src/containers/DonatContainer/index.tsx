import { useEffect, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";

import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import axiosClient, { baseURL } from "../../axiosClient";
import BlueButton from "../../commonComponents/BlueButton";
import PageTitle from "../../commonComponents/PageTitle";
import ContentCard from "../../components/ContentCard";
import { url } from "../../consts";
import { InfoIcon, LargeImageIcon } from "../../icons/icons";
import routes from "../../routes";
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

const DonatContainer = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const user = useSelector((state: any) => state.user);
  const data = useSelector((state: any) => state.personInfo).main_info;

  const [form, setForm] = useState<any>({
    message: "",
    username: "",
  });

  useEffect(() => {
    dispatch(
      tryToGetPersonInfo({
        username: pathname.slice(pathname.indexOf("@")),
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isNotRegisterWallet = useMemo(
    () => !metamaskWalletIsIntall() && !tronWalletIsIntall(),
    []
  );

  console.log(data, !user);

  return (
    <div className="donat-container">
      {isNotRegisterWallet ? (
        <div className="donat-container__registration_wrapper">
          <div className="donat-container__registration">
            <div className="donat-container__registration_title">
              In order to send donations , you need to connect your wallet
              <div className="donat-container__registration_title-choose">
                Choose one below!
              </div>
            </div>
            <ChooseWalletModal />
          </div>
        </div>
      ) : (
        <div className="donat-container__payment_wrapper">
          <div className="donat-container__payment">
            <div className="donat-container__payment_title">
              Become supporter of {data && (data.person_name || data.username)}
            </div>
            <div className="donat-container__payment-row">
              <div className="donat-container__payment-column">
                <div className="donat-container__payment_creator_avatar">
                  {data.avatarlink ? (
                    <img
                      src={
                        data.avatarlink &&
                        data.avatarlink.length > 0 &&
                        `${url + data.avatarlink}`
                      }
                      alt="avavta"
                    />
                  ) : (
                    <div className="icon" />
                  )}
                </div>
                <div className="donat-container__payment_creator_description">
                  {data.user_description ||
                    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur, natus eveniet? Hic atque dolorum vero vitae excepturi laborum quia totam sint quos! Quod eum blanditiis repellendus officia labore accusamus assumenda!"}
                </div>
                <div className="donat-container__payment_wallet_warning">
                  {data && (data.person_name || data.username)} only accepts
                  donations via Polygon Mumbai Testnet. Please switch to
                  Metamask and appropriate network!
                </div>
              </div>
              <div className="donat-container__payment-column">
                <div className="donat-container__payment_inputs">
                  {Boolean(Object.keys(user).length) ? (
                    <textarea
                      className="donat-container__payment_inputs-message"
                      placeholder="Type your message here..."
                      value={form.message}
                      onChange={(event) => {
                        setForm({
                          ...form,
                          message: event.target.value,
                        });
                      }}
                    />
                  ) : (
                    <>
                      <input
                        placeholder="Your username"
                        className="donat-container__payment_inputs-name"
                        value={form.username}
                        onChange={(event) => {
                          setForm({
                            ...form,
                            username: event.target.value,
                          });
                        }}
                      />

                      <input
                        className="donat-container__payment_inputs-message"
                        placeholder="Type your message here..."
                        value={form.message}
                        onChange={(event) => {
                          setForm({
                            ...form,
                            message: event.target.value,
                          });
                        }}
                      />
                    </>
                  )}
                </div>
                <SupportModal
                  additionalFields={form}
                  notTitle
                  modificator="donat-page"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonatContainer;
