import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import BlueButton from "../../commonComponents/BlueButton";

import postData from "../../functions/postData";
import {
  CloseModalCrossIcon,
  LargeBackerIcon,
  LargeCreatorIcon,
} from "../../icons/icons";
import { closeModal } from "../../store/types/Modal";
import "./styles.sass";
import getTronWallet, { getMetamaskWallet, tronWalletIsIntall } from "../../functions/getTronWallet";
import { useNavigate } from "react-router";
import routes from "../../routes";
import { setUser, tryToGetUser } from "../../store/types/User";
import { addNotification } from "../../utils";

const RegistrationModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mainWallet = useSelector((state: any) => state.wallet);

  useEffect(() => {
    const clickHandler = (event: React.MouseEvent<HTMLElement> | any) => {
      if (event.target && event.target.className) {
        if (event.target.className.includes("registration-modal")) {
          return true;
        }
      } else {
        dispatch(closeModal());
      }
    };

    document.addEventListener("click", clickHandler);

    return () => {
      document.removeEventListener("click", clickHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [choosenRole, setChoosenRole] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [isUsernameError, setIsUsernameError] = useState<boolean>(false);

  const tryToLogin = async () => {
    postData("/api/user/check-username", { username: username }).then((res) => {
      if (res.error) {
        setIsUsernameError(true);
      } else {
        const wallet = mainWallet.token || (tronWalletIsIntall() ? getTronWallet() : getMetamaskWallet());
        wallet
          ? postData("/api/user/create-user", {
              role: choosenRole,
              username: username,
              token: wallet,
              typeWallet: mainWallet.wallet || (tronWalletIsIntall() ? "tron" : "metamask")
            }).then((res) => {
              dispatch(tryToGetUser(wallet));
              navigate(routes.profile);
              dispatch(closeModal());
            })
          : addNotification({
              type: "danger",
              title: "TronLink error",
              message:
                "An error occurred while authorizing the wallet in tronlink",
            });
      }
    });
  };

  return (
    <div className="registration-modal">
      <div
        className="registration-modal__close-button"
        onClick={() => dispatch(closeModal())}
      >
        <CloseModalCrossIcon />
      </div>

      <span className="registration-modal__title">
        <FormattedMessage id="registration_modal_title" />
      </span>

      <div className="registration-modal__cards">
        <div
          className={`registration-modal__cards__panel ${
            choosenRole === "creators" && "choosen"
          }`}
          onClick={() => setChoosenRole("creators")}
        >
          <div className="registration-modal__cards__panel__icon">
            <LargeCreatorIcon />
          </div>
          <span className="registration-modal__cards__panel__title">
            <FormattedMessage id="registration_modal_card_creator_title" />
          </span>
        </div>
        <div
          className={`registration-modal__cards__panel ${
            choosenRole === "backers" && "choosen"
          }`}
          onClick={() => setChoosenRole("backers")}
        >
          <div className="registration-modal__cards__panel__icon">
            <LargeBackerIcon />
          </div>
          <span className="registration-modal__cards__panel__title">
            <FormattedMessage id="registration_modal_card_backer_title" />
          </span>
        </div>
      </div>

      <div
        className={`registration-modal__username-input ${
          choosenRole.length > 0 && "username-input-opened"
        }`}
      >
        <span className="registration-modal__username-input__title">
          <FormattedMessage id="registration_modal_input_title" />
        </span>

        <div className="registration-modal__username-input__input">
          <input
            type="text"
            className="registration-modal__username-input__input"
            value={username}
            onChange={(event: any) => {
              setIsUsernameError(false);
              if (!event.target.name.includes(" ")) {
                if (username.length === 0) {
                  setUsername("@" + event.target.value);
                } else if (
                  event.target.value.length < username.length &&
                  event.target.value.length === 2
                ) {
                  setUsername("");
                } else {
                  setUsername(event.target.value);
                }
              }
            }}
          />
        </div>
        {isUsernameError && (
          <div className="registration-modal__username-input__error">
            <FormattedMessage id="registration_modal_input_username_error" />
          </div>
        )}

        <BlueButton
          formatId="registration_modal_input_button"
          onClick={() => tryToLogin()}
          padding="8px 64px"
          fontSize="21px"
        />
      </div>
    </div>
  );
};

export default RegistrationModal;
