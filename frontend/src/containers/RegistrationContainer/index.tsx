import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FormattedMessage } from "react-intl";
import { useDispatch } from "react-redux";
import { IShortUserData } from "types";

import { useAppSelector } from "hooks/reduxHooks";
import { WalletContext } from "contexts/Wallet";
import BaseButton from "components/BaseButton";
import FormInput from "components/FormInput";
import Loader from "components/Loader";

import axiosClient from "modules/axiosClient";
import { tryToGetUser } from "store/types/User";
import { addNotification, checkWallet } from "utils";
import { adminPath } from "consts";
import registerImg from "assets/registerImg.png";
import "./styles.sass";

const RegistrationContainer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const walletConf = useContext(WalletContext);

  const { id } = useAppSelector(({ user }) => user);

  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isUsernameError, setIsUsernameError] = useState<boolean>(false);

  const tryToLogin = async () => {
    const blockchainData = await walletConf.getWalletData();

    if (blockchainData) {
      const { address } = blockchainData;
      if (address) {
        const { data, status } = await axiosClient.get(
          `/api/user/check-username/${username}`
        );

        if (status === 200) {
          const { error } = data;

          if (error) {
            setIsUsernameError(true);
          } else {
            const { status } = await axiosClient.post("/api/user/", {
              username,
              roleplay: "creators",
              wallet_address: address,
            } as IShortUserData);

            if (status === 200) {
              dispatch(tryToGetUser(address));
              navigate(`/${adminPath}/dashboard`);
            }
          }
        }
      } else {
        addNotification({
          type: "danger",
          title: "Auth error",
          message: "An error occurred while authorizing the wallet",
        });
      }
    }
  };

  useEffect(() => {
    const checkBlockchain = async () => {
      setLoading(true);
      await checkWallet({ walletConf, dispatch, navigate });
      setLoading(false);
    };

    id ? navigate(`/${adminPath}/dashboard`) : checkBlockchain();
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

        <div className="input">
          <FormInput
            value={username}
            setValue={(value) => {
              setIsUsernameError(false);
              if (username.length === 0) {
                setUsername("@" + value);
              } else if (value.length < username.length && value.length === 2) {
                setUsername("");
              } else {
                setUsername(value);
              }
            }}
          />
        </div>
        {isUsernameError && (
          <div className="error">
            <FormattedMessage id="registration_modal_input_username_error" />
          </div>
        )}

        <BaseButton
          formatId="registration_modal_input_button"
          onClick={tryToLogin}
          padding="8px 64px"
          fontSize="21px"
          disabled={!Boolean(username.length)}
          isMain
        />
      </div>
    </div>
  );
};

export default RegistrationContainer;
