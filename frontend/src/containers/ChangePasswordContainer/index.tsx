import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { FormattedMessage } from "react-intl";
import clsx from "clsx";

import BaseButton from "components/BaseButton";
import FormInput from "components/FormInput";
import { HeaderBanner } from "components/HeaderComponents/HeaderBanner";
import Loader from "components/Loader";

import {
  useChangePasswordMutation,
  useCheckTokenQuery,
} from "store/services/AuthService";
import useAuth from "hooks/useAuth";
import { addErrorNotification, setAuthToken, delay } from "utils";
import { dashboardPath, delayNotVisibleBanner, RoutePaths } from "consts";
import "./styles.sass";

interface IPasswordsForm {
  password: string;
  confirmPassword: string;
}

const initState: IPasswordsForm = {
  password: "",
  confirmPassword: "",
};

const ChangePasswordContainer = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { checkAuth } = useAuth();

  const tokenId = searchParams.get("token");
  const {
    data,
    isLoading: isTokenLoading,
    isError: isTokenError,
  } = useCheckTokenQuery(tokenId ?? skipToken);

  const [changePassword, { isLoading, isSuccess, isError }] =
    useChangePasswordMutation();

  const [passwordForm, setPasswordForm] = useState<IPasswordsForm>(initState);
  const [isNotValid, setIsNotValid] = useState(false);

  const { password, confirmPassword } = passwordForm;

  const inputHandler = (key: keyof IPasswordsForm) => (value: string) => {
    setIsNotValid(false);
    setPasswordForm((form) => ({ ...form, [key]: value }));
  };

  const btnHandler = async () => {
    try {
      if (isNotEmpty && password === confirmPassword) {
        const { access_token } = await changePassword(password).unwrap();
        if (access_token) {
          setAuthToken(access_token);
          await checkAuth();
          await delay({
            ms: 3000,
            cb: () => navigate(dashboardPath),
          });
        }
      } else {
        setIsNotValid(true);
        addErrorNotification({ message: "Passwords must match" });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isNotEmpty = useMemo(
    () => Boolean(password.length && confirmPassword.length),
    [password, confirmPassword]
  );

  useEffect(() => {
    if (data) setAuthToken(data.access_token);
  }, [data]);

  useEffect(() => {
    if (!tokenId) addErrorNotification({ message: "Invalid token" });
    if (!tokenId || isTokenError) navigate(RoutePaths.main);
  }, [tokenId, isTokenError]);

  useEffect(() => {
    if (isSuccess) setPasswordForm(initState);
  }, [isSuccess]);

  useEffect(() => {
    isError && setIsNotValid(true);
  }, [isError]);

  if (isTokenLoading) {
    return <Loader size="big" />;
  }

  if (!tokenId) {
    return null;
  }

  return (
    <div className="changeModal">
      {isSuccess && (
        <HeaderBanner isVisible={isSuccess}>
          <FormattedMessage id="change_success" />
        </HeaderBanner>
      )}
      <div>
        <h1 className="modalTitle">
          <FormattedMessage id="change_title" />
        </h1>
        <div className="changeInputs">
          <div className="changeInputWrapper">
            <FormInput
              typeInput="password"
              value={password}
              setValue={inputHandler("password")}
              placeholder="input_placeholder_password"
              modificator={clsx("changeInput", {
                isNotValid,
              })}
            />
          </div>

          <div className="changeInputWrapper">
            <FormInput
              typeInput="password"
              value={confirmPassword}
              setValue={inputHandler("confirmPassword")}
              placeholder="input_placeholder_confirm_password"
              modificator={clsx("changeInput", {
                isNotValid,
              })}
            />
          </div>

          <div className="btnWrapper">
            <BaseButton
              formatId="change_button"
              onClick={btnHandler}
              modificator="changeBtn"
              disabled={!isNotEmpty || isLoading}
              isMain
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordContainer;
