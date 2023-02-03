import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FormattedMessage } from "react-intl";
import { useDispatch } from "react-redux";
import request from "axios";
import { IShortUserData } from "types";

import { useAppSelector } from "hooks/reduxHooks";
import { WalletContext } from "contexts/Wallet";
import BaseButton from "components/BaseButton";
import FormInput from "components/FormInput";
import Loader from "components/Loader";

import axiosClient from "modules/axiosClient";
import { tryToGetUser } from "store/types/User";
import { addNotification, checkWallet } from "utils";
import { RoutePaths } from "routes";
import registerImg from "assets/registerImg.png";
import "./styles.sass";

const RegistrationContainer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const walletConf = useContext(WalletContext);

  const { id } = useAppSelector(({ user }) => user);

  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);

  const inputHnadler = (value: string) => {
    setUsernameError(null);
    if (username.length === 0) setUsername("@" + value);
    else if (value.length < username.length && value.length === 2)
      setUsername("");
    else setUsername(value);
  };

  const tryToLogin = async () => {
    try {
      const blockchainData = await walletConf.getWalletData();

      if (blockchainData) {
        const { address } = blockchainData;
        if (address) {
          const { status } = await axiosClient.post("/api/user/", {
            username,
            roleplay: "creators",
            wallet_address: address,
          } as IShortUserData);

          if (status === 200) {
            dispatch(tryToGetUser(address));
            navigate(`/${RoutePaths.admin}/${RoutePaths.dashboard}`);
          }
        } else
          addNotification({
            type: "danger",
            title: "Auth error",
            message: "An error occurred while authorizing the wallet",
          });
      }
    } catch (error) {
      if (request.isAxiosError(error)) {
        const { response } = error;
        if (response) {
          const { data } = response;
          setUsernameError((data as any).message);
        }
      }
    }
  };

  useEffect(() => {
    const checkBlockchain = async () => {
      setLoading(true);
      await checkWallet({ walletConf, dispatch, navigate });
      setLoading(false);
    };

    id
      ? navigate(`/${RoutePaths.admin}/${RoutePaths.dashboard}`)
      : checkBlockchain();
  }, [id, walletConf]);

  if (loading)
    return (
      <div className="loader-page">
        <Loader size="big" />
      </div>
    );

  return (
    <div className="registration-modal">
      <span className="title">
        <FormattedMessage id="registration_modal_title" />
      </span>
      <div className="img">
        <img src={registerImg} alt="registerImg" />
      </div>
      <div className="username-input">
        <span className="title">
          <FormattedMessage id="registration_modal_input_title" />
        </span>

        <div className="register-input">
          <FormInput value={username} setValue={inputHnadler} />
        </div>
        {usernameError && <div className="error">{usernameError}</div>}

        <div className="btn-wrapper">
          <BaseButton
            formatId="registration_modal_input_button"
            onClick={tryToLogin}
            modificator="register-btn"
            disabled={!Boolean(username.length)}
            isMain
          />
        </div>
      </div>
    </div>
  );
};

export default RegistrationContainer;
