import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FormattedMessage } from "react-intl";
import request from "axios";
import { IShortUserData } from "types";

import { useAppSelector } from "hooks/reduxHooks";
import { WalletContext } from "contexts/Wallet";
import BaseButton from "components/BaseButton";
import FormInput from "components/FormInput";
import Loader from "components/Loader";

import { useWallet } from "hooks/walletHooks";
import { useRegisterUserMutation } from "store/services/UserService";
import { addNotification } from "utils";
import { RoutePaths } from "routes";
import registerImg from "assets/registerImg.png";
import "./styles.sass";

const RegistrationContainer = () => {
  const walletConf = useContext(WalletContext);
  const { id } = useAppSelector(({ user }) => user);

  const navigate = useNavigate();
  const { checkWallet, loading } = useWallet();
  const [registerUser] = useRegisterUserMutation();

  const [username, setUsername] = useState<string>("");

  const inputHnadler = (value: string) => {
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
          const newUser = await registerUser({
            username,
            roleplay: "creators",
            wallet_address: address,
          } as IShortUserData).unwrap();

          if (newUser.id)
            navigate(`/${RoutePaths.admin}/${RoutePaths.dashboard}`);
        } else
          addNotification({
            type: "danger",
            title: "Auth error",
            message: "An error occurred while authorizing the wallet",
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const checkBlockchain = async () => await checkWallet(true);

    id
      ? navigate(`/${RoutePaths.admin}/${RoutePaths.dashboard}`)
      : checkBlockchain();
  }, [id]);

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
