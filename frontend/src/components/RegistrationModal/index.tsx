import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import BaseButton from "../../components/BaseButton";

import postData from "../../functions/postData";
import { getMetamaskData } from "../../functions/getWalletData";
import { useNavigate } from "react-router";
import { tryToGetUser } from "../../store/types/User";
import { addNotification } from "../../utils";
import FormInput from "../FormInput";
import registerImg from "../../assets/registerImg.png";
import "./styles.sass";

const RegistrationModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mainWallet = useSelector((state: any) => state.wallet);

  const [username, setUsername] = useState<string>("");
  const [isUsernameError, setIsUsernameError] = useState<boolean>(false);

  const tryToLogin = async () => {
    postData("/api/user/check-username", { username: username }).then(
      async (res) => {
        if (res.error) {
          setIsUsernameError(true);
        } else {
          let wallet: string | undefined = "";

          if (mainWallet.wallet === "metamask") {
            const metaMaskWallet = await getMetamaskData();

            wallet = metaMaskWallet?.address;
          }

          wallet
            ? postData("/api/user/create-user", {
                role: "creators",
                username: username,
                token: wallet,
                typeWallet: mainWallet.wallet || "metamask",
              }).then(() => {
                dispatch(tryToGetUser(wallet as string));
                navigate("/");
              })
            : addNotification({
                type: "danger",
                title: "Auth error",
                message: "An error occurred while authorizing the wallet",
              });
        }
      }
    );
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
