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
import { setMainWallet } from "../../store/types/Wallet";
import { checkIsExistUser } from "../../utils";
import { tryToGetUser } from "../../store/types/User";

const maxlength = 120;

const DonatContainer = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const user = useSelector((state: any) => state.user);
  const data = useSelector((state: any) => state.personInfo).main_info;
  const mainWallet = useSelector((state: any) => state.wallet);

  const [form, setForm] = useState<any>({
    message: "",
    username: "",
  });

  useEffect(() => {
    const pathnameEnd = pathname.slice(pathname.indexOf("@"));

    const checkUser = async () => {
      if (mainWallet.token) {
        const isExist = await checkIsExistUser(mainWallet.token);

        if (isExist) {
          dispatch(tryToGetUser(mainWallet.token));
        }

      }
      console.log(user);
      
      !Object.keys(user) && dispatch(setMainWallet({}));
      dispatch(
        tryToGetPersonInfo({
          username: pathnameEnd.slice(0, pathnameEnd.indexOf("/")),
        })
      );
    };

    // checkUser()
    !Object.keys(user) && dispatch(setMainWallet({}));
      dispatch(
        tryToGetPersonInfo({
          username: pathnameEnd.slice(0, pathnameEnd.indexOf("/")),
        })
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isNotRegisterWallet = useMemo(
    () => !metamaskWalletIsIntall() && !tronWalletIsIntall(),
    []
  );

  return (
    <div className="donat-container">
      {isNotRegisterWallet ||
      // !Object.keys(user).length ||
      !Object.keys(mainWallet).length ? (
        <div className="donat-container__registration_wrapper">
          <div className="donat-container__registration">
            <div className="donat-container__registration_title">
              In order to send donations , you need to connect your wallet
              <div className="donat-container__registration_title-choose">
                Choose one below!
              </div>
            </div>
            <ChooseWalletModal withoutLogin />
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
                  {data.user_description}
                </div>
                <div className="donat-container__payment_wallet_warning">
                  {data.tron_token &&
                    !data.metamask_token &&
                    !user.tron_token &&
                    `${data && (data.person_name || data.username)} only accepts
                    donations via Tron. Please switch to
                    Tron and appropriate network!`}
                  {!data.tron_token &&
                    !user.metamask_token &&
                    data.metamask_token &&
                    `${data && (data.person_name || data.username)} only accepts
                    donations via Polygon Mumbai Testnet. Please switch to
                    Metamask and appropriate network!`}
                </div>
              </div>
              <div className="donat-container__payment-column">
                <div className="donat-container__payment_inputs">
                  {Boolean(Object.keys(user).length) ? (
                    <div className="donat-container__payment_inputs-item">
                      <textarea
                        maxLength={maxlength || 524288}
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
                      <span className="donat-container__payment_inputs__subtitle">
                        Number of input characters - {form.message.length} /
                        {maxlength}
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="donat-container__payment_inputs-item">
                        <input
                          placeholder="Your username"
                          className="donat-container__payment_inputs-name"
                          value={form.username}
                          onChange={(event) => {
                            if (form.username.length === 0) {
                              setForm({
                                ...form,
                                username: "@" + event.target.value,
                              });
                            } else
                              setForm({
                                ...form,
                                username: event.target.value,
                              });
                          }}
                        />
                      </div>
                      <div className="donat-container__payment_inputs-item">
                        <input
                          maxLength={maxlength || 524288}
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
                        <div className="donat-container__payment_inputs__subtitle">
                          Number of input characters - {form.message.length} /
                          {maxlength}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <SupportModal
                  additionalFields={form}
                  setForm={setForm}
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
