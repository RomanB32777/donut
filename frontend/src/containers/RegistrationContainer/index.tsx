import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FormattedMessage } from "react-intl";
import { useDispatch } from "react-redux";
import { IShortUserData } from "types";

import { useAppSelector } from "hooks/reduxHooks";
import { WalletContext } from "../../contexts/Wallet";
import BaseButton from "../../components/BaseButton";
import FormInput from "../../components/FormInput";

import axiosClient from "../../modules/axiosClient";
import { tryToGetUser } from "../../store/types/User";
import { addNotification } from "../../utils";
import { adminPath } from "../../consts";
import registerImg from "../../assets/registerImg.png";
import "./styles.sass";

const RegistrationContainer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { walletConf } = useContext(WalletContext);

  const { id } = useAppSelector(({ user }) => user);

  const [username, setUsername] = useState<string>("");
  const [isUsernameError, setIsUsernameError] = useState<boolean>(false);

  useEffect(() => {
    id && navigate(`/${adminPath}`);
  }, [id]);

  const tryToLogin = async () => {
    const blockchainData = await walletConf.getBlockchainData();

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
              navigate(`/${adminPath}`);
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

  return (
    <div className="registration-modal">
      <span className="registration-modal__title">
        <FormattedMessage id="registration_modal_title" />
      </span>
      <div className="registration-modal__img">
        <img src={registerImg} alt="registerImg" />
      </div>
      <div className="registration-modal__username-input">
        <span className="registration-modal__username-input__title">
          <FormattedMessage id="registration_modal_input_title" />
        </span>

        <div className="registration-modal__username-input__input">
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
          <div className="registration-modal__username-input__error">
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
