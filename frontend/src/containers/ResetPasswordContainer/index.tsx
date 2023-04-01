import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import clsx from "clsx";

import BaseButton from "components/BaseButton";
import FormInput from "components/FormInput";
import { HeaderBanner } from "components/HeaderComponents/HeaderBanner";

import { useResetPasswordMutation } from "store/services/AuthService";
import { delayNotVisibleBanner } from "consts";
import "./styles.sass";

const ResetPasswordContainer = () => {
  const [resetPassword, { isLoading, isSuccess, isError }] =
    useResetPasswordMutation();
  const [email, setEmail] = useState("");
  const [isNotValid, setIsNotValid] = useState(false);
  const [isVisibleBanner, setIsVisibleBanner] = useState(false);

  const inputHnadler = (value: string) => {
    setIsNotValid(false);
    setEmail(value);
  };

  const btnHandler = async () => {
    await resetPassword(email);
  };

  useEffect(() => {
    if (isSuccess) {
      setIsVisibleBanner(true);
      setTimeout(() => setIsVisibleBanner(false), delayNotVisibleBanner);
      setEmail("");
    }
  }, [isSuccess]);

  useEffect(() => {
    isError && setIsNotValid(true);
  }, [isError]);

  return (
    <div className="resetModal">
      {isSuccess && (
        <HeaderBanner isVisible={isVisibleBanner}>
          <FormattedMessage id="reset_send" />
        </HeaderBanner>
      )}
      <h1 className="modalTitle">
        <FormattedMessage id="reset_title" />
      </h1>
      <div className="resetInput">
        <span className="title">
          <FormattedMessage id="reset_input_title" />
        </span>

        <div className="emailInputWrapper">
          <FormInput
            value={email}
            setValue={inputHnadler}
            placeholder="input_placeholder_email"
            modificator={clsx("emailInput", {
              isNotValid,
            })}
          />
        </div>

        <div className="btnWrapper">
          <BaseButton
            formatId="reset_button"
            onClick={btnHandler}
            modificator="resetBtn"
            disabled={!Boolean(email.length) || isLoading}
            isMain
          />
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordContainer;
