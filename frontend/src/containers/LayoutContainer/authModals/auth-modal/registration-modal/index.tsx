import { useEffect, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { userRoles, IRegisterUser } from "types";

import BaseButton from "components/BaseButton";
import FormInput from "components/FormInput";
import { HeaderBanner } from "components/HeaderComponents/HeaderBanner";

import {
  useCreateUserMutation,
  useLazyGetUserQuery,
} from "store/services/UserService";
import { useRegisterUserMutation } from "store/services/AuthService";
import useAuth from "hooks/useAuth";
import { delay, isValidateFilledForm, scrollToPosition } from "utils";
import { dashboardPath, delayNotVisibleBanner } from "consts";
import { IAuthTypeModal } from "appTypes";
import "./styles.sass";

interface IRegistrationModal extends IAuthTypeModal {
  roleplay: userRoles;
}

type IFormValid = Record<keyof Omit<IRegisterUser, "roleplay">, string | null>;

const initState: IRegisterUser = {
  email: "",
  username: "",
  password: "",
  roleplay: "creators",
};

const initValidState: IFormValid = {
  username: null,
  email: null,
  password: null,
};

const RegistrationCreatorModal: React.FC<IRegistrationModal> = ({
  changeTypeModal,
  roleplay,
}) => {
  const navigate = useNavigate();
  const { address } = useAccount();
  const { checkWebToken, closeAuthModal } = useAuth();
  const [registerUser, { isLoading, isSuccess, error }] =
    useRegisterUserMutation();
  const [
    createUser,
    { data, isSuccess: isCreateSuccess, error: creatingUser },
  ] = useCreateUserMutation();
  const [getUser] = useLazyGetUserQuery();

  const [form, setForm] = useState<IRegisterUser>({ ...initState, roleplay });
  const [isNotValidFields, setIsNotValidFields] = useState(initValidState);
  const [isVisibleBanner, setIsVisibleBanner] = useState(false);

  const isCreator = roleplay === "creators";
  const { email, username, password } = form;

  const toLogin = () => changeTypeModal("login");

  const inputHandler = (key: keyof IRegisterUser) => (value: string) => {
    const setValue = () => setForm((form) => ({ ...form, [key]: value }));

    if (key === "username") {
      if (!username) setForm((form) => ({ ...form, [key]: `@${value}` }));
      else if (value.length < username.length && value.length === 2) {
        setForm((form) => ({ ...form, [key]: "" }));
      } else setValue();
    } else setValue();

    setIsNotValidFields(initValidState);
  };

  const btnHandler = async () => {
    if (isCreator) {
      await registerUser(form);
      await delay({
        ms: delayNotVisibleBanner,
        cb: () => {
          setIsVisibleBanner(false);
        },
      });
      setForm(initState);
    } else if (address) {
      await checkWebToken();
      await createUser({
        username,
        roleplay,
        walletAddress: address,
      });
    }
  };

  const isFilledForm = useMemo(() => {
    if (isCreator) return isValidateFilledForm(Object.values(form));
    return !!form.username;
  }, [isCreator, form]);

  useEffect(() => {
    if (isSuccess || isCreateSuccess) {
      closeAuthModal();

      if (isCreator) setIsVisibleBanner(true);
      else setForm(initState);
    }
  }, [isSuccess, isCreateSuccess, isCreator]);

  useEffect(() => {
    const successCreatingEvent = async () => {
      await getUser({ id: data?.id });
      scrollToPosition();
      navigate(dashboardPath);
    };

    if (isCreateSuccess && data) successCreatingEvent();
  }, [data, isCreateSuccess]);

  useEffect(() => {
    const errorObj = error || creatingUser;
    if (errorObj) {
      const { data } = errorObj as FetchBaseQueryError;

      if (data) {
        const message = (data as any).message as string | string[];

        if (Array.isArray(message)) {
          const notValidFields = message.reduce((acc, curr) => {
            const [field, messageText] = curr.split(":");
            return { ...acc, [field]: messageText };
          }, initValidState);

          setIsNotValidFields(notValidFields);
        } else {
          const [field, messageText] = message.split(":");
          setIsNotValidFields((fields) => ({
            ...fields,
            [field]: messageText,
          }));
        }
      }
    }
  }, [error, creatingUser]);

  return (
    <div className="registrationModal">
      {isSuccess && (
        <HeaderBanner isVisible={isVisibleBanner}>
          <FormattedMessage id="sent_activation_link" values={{ email }} />
        </HeaderBanner>
      )}
      <div className="registrationModalContent">
        <div className="registrationInputs">
          {isCreator && (
            <div className="registrationInputWrapper">
              <FormInput
                value={email}
                setValue={inputHandler("email")}
                modificator={clsx("registrationInput", {
                  isNotValid: !!isNotValidFields.email,
                })}
                descriptionInput={isNotValidFields.email}
                descriptionModificator="notValidMessage"
                placeholder="input_placeholder_email"
              />
            </div>
          )}
          <div className="registrationInputWrapper">
            <FormInput
              value={username}
              setValue={inputHandler("username")}
              modificator={clsx("registrationInput", {
                isNotValid: !!isNotValidFields.username,
              })}
              descriptionInput={isNotValidFields.username}
              descriptionModificator="notValidMessage"
              placeholder="input_placeholder_username"
            />
          </div>
          {isCreator && (
            <div className="registrationInputWrapper">
              <FormInput
                value={password}
                typeInput="password"
                setValue={inputHandler("password")}
                modificator={clsx("registrationInput", {
                  isNotValid: !!isNotValidFields.password,
                })}
                descriptionInput={isNotValidFields.password}
                descriptionModificator="notValidMessage"
                placeholder="input_placeholder_password"
              />
            </div>
          )}
          <div className="btnWrapper">
            <BaseButton
              formatId="registration_button"
              onClick={btnHandler}
              modificator="registrationBtn"
              disabled={!isFilledForm || isLoading}
              isMain
            />
          </div>
          {isCreator && (
            <p className="loginLink">
              <FormattedMessage id="registration_have_account" />
              <span onClick={toLogin}>
                <FormattedMessage id="registration_link" />
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationCreatorModal;
