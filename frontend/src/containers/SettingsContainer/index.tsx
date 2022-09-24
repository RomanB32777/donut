import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Col, Row } from "antd";
import axiosClient from "../../axiosClient";
import PageTitle from "../../commonComponents/PageTitle";
import FormInput from "../../components/FormInput";
import BaseButton from "../../commonComponents/BaseButton";
import ConfirmPopup from "../../components/ConfirmPopup";
import UploadImage from "../../components/UploadImage";
import { setUser, tryToGetUser } from "../../store/types/User";
import walletSmall from "../../assets/MetaMask_Fox.png";
import {
  addNotification,
  addSuccessNotification,
  copyStr,
  sendFile,
  shortStr,
} from "../../utils";
import { setMainWallet } from "../../store/types/Wallet";
import { setLoading } from "../../store/types/Loading";
import { IFileInfo } from "../../types";
import { url } from "../../consts";
import "./styles.sass";

const SettingsContainer = () => {
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formSettings, setFormSettings] = useState<{
    avatar: IFileInfo;
    username: string;
    wallet: string;
  }>({
    avatar: {
      preview: "",
      file: null,
    },
    username: "",
    wallet: "",
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
        dispatch(tryToGetUser(user.metamask_token));
        addSuccessNotification("Data saved successfully");
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
          (await sendFile(avatar.file, user, "/api/user/edit-image/"));
        dispatch(tryToGetUser(user.metamask_token));
        addSuccessNotification("Data saved successfully");
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
    const { id, username, avatarlink, metamask_token } = user;
    id &&
      setFormSettings({
        username: username,
        wallet: metamask_token,
        avatar: {
          ...formSettings.avatar,
          preview: avatarlink ? `${url + user.avatarlink}` : "",
        },
      });
  }, [user]);

  const deleteProfile = async () => {
    await axiosClient.post("/api/user/delete/", {
      user_id: user.id,
    });
    dispatch(setUser(""));
    localStorage.removeItem("main_wallet");
    dispatch(setMainWallet({}));
    dispatch(setLoading(false));
    navigate("/landing");
  };

  const shortWalletToken = useMemo(
    () => user.metamask_token && shortStr(user.metamask_token, 22),
    [user]
  );

  const { username, wallet, avatar } = formSettings;

  return (
    <div className="settingsPage-container">
      <PageTitle formatId="page_title_settings" />
      <div className="stats-drawer__form">
        <Row gutter={[0, 18]} className="form">
          <Col span={18}>
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
                    InputCol={16}
                  />
                </Col>
                <Col span={7}>
                  <div
                    className="form-element__action"
                    onClick={avatarBtnClick}
                  >
                    Change
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
          <Col span={18}>
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
                    InputCol={16}
                  />
                </Col>
                <Col span={7}>
                  <div
                    className="form-element__action"
                    onClick={usernameBtnClick}
                  >
                    Change
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
          <Col span={18}>
            <div className="form-element">
              <Row justify="space-between" align="middle">
                <Col span={16}>
                  <FormInput
                    label="Wallet:"
                    name="wallet"
                    value={shortWalletToken}
                    addonBefore={
                      <img width="18" src={walletSmall} alt="walletIcon" />
                    }
                    labelCol={8}
                    InputCol={16}
                  />
                </Col>
                <Col span={7}>
                  <div
                    className="form-element__action"
                    onClick={() => {
                      copyStr(wallet);
                    }}
                  >
                    Copy
                  </div>
                  {/* <div className="form-element__action">Delete from account</div> */}
                </Col>
              </Row>
            </div>
          </Col>
          <Col span={24}>
            <ConfirmPopup confirm={deleteProfile}>
              <BaseButton
                formatId="profile_form_delete_button"
                padding="6px 30px"
                onClick={() => console.log()}
                fontSize="18px"
                disabled={loading}
              />
            </ConfirmPopup>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default SettingsContainer;
