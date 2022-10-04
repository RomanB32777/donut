import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FormattedMessage } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import BaseButton from "../../components/BaseButton";

import postData from "../../functions/postData";
import { tryToGetUser } from "../../store/types/User";
import { addNotification } from "../../utils";
import FormInput from "../FormInput";
import { walletsConf } from "../../consts";
import { setMainWallet } from "../../store/types/Wallet";
import registerImg from "../../assets/registerImg.png";
import "./styles.sass";

const RegistrationModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.user);
  // const mainWallet = useSelector((state: any) => state.wallet);

  const [username, setUsername] = useState<string>("");
  const [isUsernameError, setIsUsernameError] = useState<boolean>(false);

  useEffect(() => {
    user.id && navigate("/");
  }, [user]);

  const tryToLogin = async () => {
    const wallet = process.env.REACT_APP_WALLET || "metamask";
    const { address } = await walletsConf[wallet].getWalletData(
      process.env.REACT_APP_BLOCKCHAIN
    );

    if (address) {
      dispatch(
        setMainWallet({
          wallet,
          token: address,
        })
      );

      postData("/api/user/check-username", { username: username }).then(
        async (res) => {
          if (res.error) {
            setIsUsernameError(true);
          } else {
            postData("/api/user/create-user", {
              role: "creators",
              username: username,
              token: address,
              typeWallet: process.env.REACT_APP_WALLET || "metamask",
            }).then(() => {
              dispatch(tryToGetUser(address as string));
              navigate("/");
            });
          }
        }
      );
    } else {
      addNotification({
        type: "danger",
        title: "Auth error",
        message: "An error occurred while authorizing the wallet",
      });
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
          onClick={() => tryToLogin()}
          padding="8px 64px"
          fontSize="21px"
          disabled={!Boolean(username.length)}
          isBlue
        />
      </div>
    </div>
  );
};

export default RegistrationModal;
