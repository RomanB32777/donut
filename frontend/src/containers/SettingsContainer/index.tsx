import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { Col, Row } from "antd";
import clsx from "clsx";

import { useAppSelector } from "hooks/reduxHooks";
import axiosClient from "modules/axiosClient";
import { WalletContext } from "contexts/Wallet";
import PageTitle from "components/PageTitle";
import FormInput from "components/FormInput";
import BaseButton from "components/BaseButton";
import ConfirmPopup from "components/ConfirmPopup";
import UploadImage from "components/UploadImage";
import SwitchForm from "components/SwitchForm";
import { tryToGetUser } from "store/types/User";
import {
  addNotification,
  addSuccessNotification,
  copyStr,
  logoutUser,
  sendFile,
  shortStr,
} from "utils";
import { IFileInfo } from "appTypes";
import "./styles.sass";

const SettingsContainer = () => {
  const user = useAppSelector(({ user }) => user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { walletConf } = useContext(WalletContext);

  const [formSettings, setFormSettings] = useState<{
    avatar: IFileInfo;
    username: string;
    wallet: string;
    spamFilter: boolean;
  }>({
    avatar: {
      preview: "",
      file: null,
    },
    username: "",
    wallet: "",
    spamFilter: false,
  });

  const [loading, setSettingsLoading] = useState<boolean>(false);

  const usernameBtnClick = async () => {
    if (!loading) {
      try {
        setSettingsLoading(true);
        const { username } = formSettings;
        await axiosClient.put("/api/user/edit/", {
          username,
          user_id: user.id,
        });
        dispatch(tryToGetUser(user.wallet_address));
        addSuccessNotification({ message: "Data saved successfully" });
      } catch (error) {
        addNotification({
          type: "danger",
          title: "Error",
          message:
            (error as any)?.response?.data?.message ||
            `An error occurred while saving data`,
        });
      } finally {
        setSettingsLoading(false);
      }
    }
  };

  const avatarBtnClick = async () => {
    if (!loading) {
      try {
        setSettingsLoading(true);
        const { avatar } = formSettings;
        avatar.file &&
          (await sendFile({
            file: avatar.file,
            username: user.username,
            url: "/api/user/edit-image/",
            isEdit: true,
          }));
        dispatch(tryToGetUser(user.wallet_address));
        addSuccessNotification({ message: "Data saved successfully" });
      } catch (error) {
        addNotification({
          type: "danger",
          title: "Error",
          message:
            (error as any)?.response?.data?.message ||
            `An error occurred while saving data`,
        });
      } finally {
        setSettingsLoading(false);
      }
    }
  };

  useEffect(() => {
    const { id, username, avatar } = user;
    id &&
      setFormSettings({
        ...formSettings,
        username: username,
        wallet: user.wallet_address,
        avatar: {
          ...formSettings.avatar,
          preview: avatar || "",
        },
      });
  }, [user]);

  const deleteProfile = async () => {
    await axiosClient.delete(`/api/user/${user.id}`);
    logoutUser({ dispatch, navigate });
  };

  const shortWalletToken = useMemo(
    () => user.wallet_address && shortStr(user.wallet_address, 12),
    [user]
  );

  const { username, wallet, avatar, spamFilter } = formSettings;

  return (
    <div className="settingsPage-container">
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
                    inputCol={16}
                  />
                </Col>
                <Col span={7}>
                  <div
                    className={clsx("form-element__action", {
                      // active: avatar.preview.length
                      //   ? avatar.preview !== user.avatar
                      //   : avatar.preview !== user.avatar,
                    })}
                    onClick={avatarBtnClick}
                  >
                    Change
                  </div>
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
                    inputCol={16}
                    gutter={[0, 16]}
                  />
                </Col>
                <Col span={7}>
                  <div
                    className={clsx("form-element__action", {
                      active: username !== user.username,
                    })}
                    onClick={usernameBtnClick}
                  >
                    Change
                  </div>
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
                        <img src={walletConf.icon} alt="walletIcon" />
                      </div>
                    }
                    addonsModificator="wallet-addon"
                    labelCol={8}
                    inputCol={16}
                    gutter={[0, 16]}
                  />
                </Col>
                <Col span={7}>
                  <div
                    className="form-element__action"
                    onClick={() => {
                      copyStr(wallet, "address");
                    }}
                  >
                    Copy
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
          <Col xl={18} xs={24}>
            <div className="form-element">
              <SwitchForm
                label="Spam filter:"
                checked={spamFilter}
                setValue={(flag) =>
                  setFormSettings({ ...formSettings, spamFilter: flag })
                }
                labelModificator="switch-label"
                labelCol={5}
                switchCol={2}
                gutter={[0, 16]}
              />
            </div>
          </Col>
          <Col span={24}>
            <div className="btn-bottom">
              <ConfirmPopup confirm={deleteProfile}>
                <BaseButton
                  title="Delete account"
                  padding="6px 30px"
                  fontSize="18px"
                  disabled={loading}
                  isBlack
                />
              </ConfirmPopup>
              <BaseButton
                title="Save changes"
                padding="6px 30px"
                fontSize="18px"
                modificator="save-btn"
                disabled={loading}
                isMain
              />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default SettingsContainer;
