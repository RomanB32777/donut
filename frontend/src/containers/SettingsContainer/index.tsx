import { useContext, useEffect, useMemo, useState } from "react";
import { Col, Row } from "antd";
import clsx from "clsx";
import { IUser, userDataKeys } from "types";

import { useAppSelector } from "hooks/reduxHooks";
import { WalletContext } from "contexts/Wallet";
import PageTitle from "components/PageTitle";
import FormInput from "components/FormInput";
import BaseButton from "components/BaseButton";
import ConfirmPopup from "components/ConfirmPopup";
import UploadImage from "components/UploadImage";
import SwitchForm from "components/SwitchForm";

import {
  useDeleteUserMutation,
  useEditUserAvatarMutation,
  useEditUserMutation,
} from "store/services/UserService";
import { useLogoutUser } from "hooks/userHooks";
import { copyStr, shortStr } from "utils";
import { initUserWithFiles } from "consts";
import { IUserWithFiles } from "appTypes";
import "./styles.sass";

const excludedСhangesFields: userDataKeys[] = [
  "id",
  "donat_page",
  "created_at",
  "roleplay",
];

const filesFields: userDataKeys[] = ["avatar"];

const SettingsContainer = () => {
  const [editUser, { isLoading: isEditUserLoading }] = useEditUserMutation();
  const [editAvatar, { isLoading: isEditAvatarLoading }] =
    useEditUserAvatarMutation();
  const [deleteUser] = useDeleteUserMutation();
  const logout = useLogoutUser();

  const user = useAppSelector(({ user }) => user);

  const walletConf = useContext(WalletContext);

  const [formSettings, setFormSettings] =
    useState<IUserWithFiles>(initUserWithFiles);

  const { username, wallet_address, avatar, spam_filter } = formSettings;

  const isLoading = useMemo(
    () => isEditUserLoading || isEditAvatarLoading,
    [isEditUserLoading, isEditAvatarLoading]
  );

  const changeUserData = async (
    changedFields: {
      key: userDataKeys;
      value: any;
    }[]
  ) => {
    if (!isLoading && changedFields.length) {
      const fileField = changedFields.find((f) => filesFields.includes(f.key));

      if (fileField) {
        await editAvatar({
          file: fileField.value,
          username: user.username,
        });
      }

      const changedFieldsWithoutFiles = changedFields.filter(
        (f) => !filesFields.includes(f.key)
      );

      if (changedFieldsWithoutFiles.length) {
        const changedUserInfo = {
          ...changedFieldsWithoutFiles.reduce(
            (acc, { key, value }) => ({
              ...acc,
              [key]: value,
            }),
            {} as IUser
          ),
        };
        await editUser({ ...changedUserInfo, id: user.id });
      }
    }
  };

  const usernameBtnClick = async () =>
    await changeUserData([{ key: "username", value: username }]);

  const saveSettings = async () => {
    const changedFields = changedElements.map((field) => {
      const key = field as userDataKeys;
      if (key === "avatar")
        return {
          key,
          value: formSettings[key].file,
        };

      return {
        key,
        value: formSettings[key],
      };
    });

    await changeUserData(changedFields);
  };

  const avatarBtnClick = async () =>
    await changeUserData([{ key: "avatar", value: avatar.file }]);

  const deleteProfile = async () => {
    await deleteUser(user.id);
    logout();
  };

  const shortWalletToken = useMemo(
    () => user.wallet_address && shortStr(user.wallet_address, 12),
    [user]
  );

  const changedElements = useMemo(
    () =>
      Object.keys(formSettings).filter((key) => {
        const keyType = key as keyof IUserWithFiles;

        if (excludedСhangesFields.includes(keyType)) return false;

        if (keyType === "avatar")
          return formSettings[keyType].preview !== user[keyType];
        else return formSettings[keyType] !== user[keyType];
      }),
    [formSettings, user]
  );

  useEffect(() => {
    const { id, username, wallet_address, spam_filter, avatar } = user;
    id &&
      setFormSettings({
        ...formSettings,
        username,
        wallet_address,
        spam_filter,
        avatar: {
          ...formSettings.avatar,
          preview: avatar || "",
        },
      });
  }, [user]);

  return (
    <div className="settingsPage-container fadeIn">
      <PageTitle formatId="page_title_settings" />
      <div className="stats-drawer__form">
        <Row gutter={[0, 18]} className="form">
          <Col xl={18} xs={24}>
            <div className="form-element">
              <Row justify="space-between" align="middle">
                <Col span={16}>
                  <UploadImage
                    label="Avatar:"
                    formats={["PNG", "JPG", "JPEG", "GIF"]}
                    filePreview={avatar.preview}
                    setFile={({ preview, file }) =>
                      setFormSettings({
                        ...formSettings,
                        avatar: {
                          file,
                          preview,
                        },
                      })
                    }
                    labelCol={8}
                    inputCol={15}
                    rowProps={{ justify: "space-between" }}
                  />
                </Col>
                <Col span={7}>
                  <p
                    className={clsx("action", {
                      active: changedElements.includes("avatar"),
                    })}
                    onClick={avatarBtnClick}
                  >
                    Change
                  </p>
                </Col>
              </Row>
            </div>
          </Col>
          <Col xl={18} xs={24}>
            <div className="form-element">
              <Row justify="space-between" align="middle">
                <Col span={16}>
                  <FormInput
                    label="Username:"
                    name="username"
                    value={username}
                    setValue={(value) =>
                      setFormSettings({ ...formSettings, username: value })
                    }
                    labelCol={8}
                    inputCol={15}
                    gutter={[0, 16]}
                    rowProps={{ justify: "space-between" }}
                  />
                </Col>
                <Col span={7}>
                  <p
                    className={clsx("action", {
                      active: changedElements.includes("username"),
                    })}
                    onClick={usernameBtnClick}
                  >
                    Change
                  </p>
                </Col>
              </Row>
            </div>
          </Col>
          <Col xl={18} xs={24}>
            <div className="form-element">
              <Row justify="space-between" align="middle">
                <Col span={16}>
                  <FormInput
                    label="Wallet:"
                    name="wallet"
                    value={shortWalletToken}
                    addonBefore={
                      <div className="wallet-icon">
                        <img
                          src={walletConf.main_contract.icon}
                          alt="walletIcon"
                        />
                      </div>
                    }
                    addonsModificator="wallet-addon"
                    labelCol={8}
                    inputCol={15}
                    gutter={[0, 16]}
                    rowProps={{ justify: "space-between" }}
                  />
                </Col>
                <Col span={7}>
                  <p
                    className="action copy"
                    onClick={() => {
                      copyStr(wallet_address, "Wallet address");
                    }}
                  >
                    Copy
                  </p>
                </Col>
              </Row>
            </div>
          </Col>
          {user.roleplay === "creators" && (
            <Col xl={18} xs={24}>
              <div className="form-element">
                <SwitchForm
                  label="Spam filter:"
                  checked={spam_filter}
                  setValue={(flag) =>
                    setFormSettings({ ...formSettings, spam_filter: flag })
                  }
                  labelModificator="switch-label"
                  labelCol={6}
                  switchCol={2}
                  gutter={[0, 16]}
                />
              </div>
            </Col>
          )}
          <Col span={24}>
            <div className="btn-bottom">
              <BaseButton
                formatId="save_changes_button"
                padding="6px 25px"
                fontSize="18px"
                modificator="save-btn"
                onClick={saveSettings}
                disabled={isLoading || !username || !changedElements.length}
                isMain
              />
              <ConfirmPopup confirm={deleteProfile}>
                <BaseButton
                  title="Delete account"
                  padding="6px 30px"
                  fontSize="18px"
                  disabled={isLoading}
                  isBlack
                />
              </ConfirmPopup>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default SettingsContainer;
