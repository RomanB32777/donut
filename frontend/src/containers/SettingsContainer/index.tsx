import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../../axiosClient";
import PageTitle from "../../commonComponents/PageTitle";
import FormInput from "../../components/FormInput";
import BaseButton from "../../commonComponents/BaseButton";
import { setUser } from "../../store/types/User";
import walletSmall from "../../assets/walletSmall.svg";
import "./styles.sass";

const SettingsContainer = () => {
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  const [formSettings, setFormSettings] = useState<any>({
    username: "",
    wallet: "",
  });

  useEffect(() => {
    user.id &&
      setFormSettings({
        username: user.username,
      });
  }, [user]);

  const deleteProfile = async () => {
    await axiosClient.post("/api/user/delete/", {
      user_id: user.id,
    });
    dispatch(setUser(""));
    sessionStorage.removeItem("main_wallet");
  };

  const { username, wallet } = formSettings;

  return (
    <div className="settingsPage-container">
      <PageTitle formatId="page_title_settings" />
      <div className="stats-drawer__form">
        <Row gutter={[0, 18]} className="form">
          <Col span={24}>
            <div className="form-element">
              <FormInput
                label="Username:"
                name="username"
                value={username}
                setValue={(value) =>
                  setFormSettings({ ...formSettings, username: value })
                }
                labelCol={4}
                InputCol={8}
              />
            </div>
          </Col>
          <Col span={24}>
            <div className="form-element">
              <FormInput
                label="Wallet:"
                name="wallet"
                value={wallet}
                addonBefore={
                  <img width="20" src={walletSmall} alt="walletIcon" />
                }
                labelCol={4}
                InputCol={8}
              />
            </div>
          </Col>
          <Col span={24}>
            <BaseButton
              formatId="profile_form_delete_button"
              padding="6px 30px"
              onClick={() => deleteProfile()}
              fontSize="18px"
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default SettingsContainer;
