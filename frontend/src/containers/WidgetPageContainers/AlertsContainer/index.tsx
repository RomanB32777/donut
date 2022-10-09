import React, { useEffect, useMemo, useState } from "react";
// import { ChromePicker } from "react-color";
import { Col, Row, Switch } from "antd";
import { useSelector } from "react-redux";
import useSound from "use-sound";
import axiosClient, { baseURL } from "../../../axiosClient";
import PageTitle from "../../../components/PageTitle";
import { addNotification, addSuccessNotification } from "../../../utils";
import ColorPicker from "../../../components/ColorPicker";
import UploadImage from "../../../components/UploadImage";
import donImg from "../../../assets/big_don.png";
import BaseButton from "../../../components/BaseButton";
import LinkCopy from "../../../components/LinkCopy";
import SelectComponent from "../../../components/SelectComponent";
import SliderForm from "../../../components/SliderForm";
import { TabsComponent } from "../../../components/TabsComponent";
import WidgetMobileWrapper from "../../../components/WidgetMobileWrapper";
import { IAlertData, initAlertData } from "../../../types";
import { url } from "../../../consts";
import { soundsList } from "../../../assets/sounds";
import "./styles.sass";

const PreviewAlertsBlock = ({ formData }: { formData: IAlertData }) => {
  const { banner, message_color, name_color, sum_color } = formData;
  return (
    <Col
      xl={10}
      md={24}
      style={{
        width: "100%",
      }}
    >
      <div className="preview-block">
        <div className="preview-block_img">
          <img src={banner.preview || donImg} alt="preview logo" />
        </div>
        <div className="preview-block_title">
          <p>
            <span
              style={{
                color: name_color,
              }}
            >
              MrBeast
            </span>{" "}
            -{" "}
            <span
              style={{
                color: sum_color,
              }}
            >
              10 USD
            </span>
          </p>
        </div>
        <p
          className="preview-block_message"
          style={{
            color: message_color,
          }}
        >
          Thank you for your stream!
        </p>
      </div>
    </Col>
  );
};

const SettingsAlertsBlock = ({
  formData,
  setFormData,
}: {
  formData: IAlertData;
  setFormData: (formData: IAlertData) => void;
}) => {
  const {
    banner,
    message_color,
    name_color,
    sum_color,
    duration,
    sound,
    voice,
    gender_voice,
  } = formData;

  const [play] = useSound(soundsList[sound]);

  return (
    <Col xl={13} md={24}>
      <Row gutter={[0, 18]} className="form">
        <Col span={24}>
          <div className="form-element">
            <UploadImage
              label="Banner:"
              formats={["PNG", "JPG", "JPEG", "GIF"]}
              filePreview={banner.preview || donImg}
              setFile={({ preview, file }) =>
                setFormData({
                  ...formData,
                  banner: {
                    file,
                    preview,
                  },
                })
              }
            />
          </div>
        </Col>
        <Col span={24}>
          <div className="form-element">
            <ColorPicker
              setColor={(color) =>
                setFormData({ ...formData, message_color: color })
              }
              color={message_color}
              label="Message color:"
              gutter={[0, 18]}
            />
          </div>
        </Col>
        <Col span={24}>
          <div className="form-element">
            <ColorPicker
              setColor={(color) =>
                setFormData({ ...formData, name_color: color })
              }
              color={name_color}
              label="Donor name color:"
              gutter={[0, 18]}
            />
          </div>
        </Col>
        <Col span={24}>
          <div className="form-element">
            <ColorPicker
              setColor={(color) =>
                setFormData({ ...formData, sum_color: color })
              }
              color={sum_color}
              label="Donation sum color:"
              gutter={[0, 18]}
            />
          </div>
        </Col>
        <Col span={24}>
          <div className="form-element">
            <SliderForm
              label="Alert duration:"
              step={1}
              max={25}
              min={15}
              setValue={(num) => setFormData({ ...formData, duration: num })}
              value={+duration}
              maxWidth={185}
              description={`${duration} sec`}
              gutter={[0, 18]}
              // labelCol={10}
            />
          </div>
        </Col>
        <Col span={24}>
          <div className="form-element">
            <Row
              style={{
                width: "100%",
              }}
              gutter={[0, 18]}
              align="middle"
            >
              <Col md={12} xs={12}>
                <span className="form-element__label">Alert sound:</span>
              </Col>
              <Col md={4}>
                <SelectComponent
                  title={sound}
                  list={Object.keys(soundsList)}
                  selectItem={(selected) => {
                    setFormData({ ...formData, sound: selected });
                    play();
                  }}
                  modificator="select-sound"
                />
              </Col>
            </Row>
          </div>
        </Col>
        <Col span={24}>
          <div className="form-element">
            <Row
              style={{
                width: "100%",
              }}
              gutter={[0, 18]}
            >
              <Col md={12} xs={24}>
                <span className="form-element__label">Voice alerts:</span>
              </Col>
              <Col md={12} xs={24}>
                <div className="voiceSwitch-wrapper">
                  <span>Disabled</span>
                  <Switch
                    checked={voice}
                    onChange={(flag) =>
                      setFormData({ ...formData, voice: flag })
                    }
                    id="voiceSwitch"
                  />
                  <span>Abled</span>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
        <Col span={24}>
          <div className="form-element">
            <Row
              style={{
                width: "100%",
              }}
            >
              <Col xs={{ offset: 0, span: 24 }} md={{ offset: 12, span: 12 }}>
                <TabsComponent
                  setTabContent={(gender_voice) =>
                    setFormData({ ...formData, gender_voice })
                  }
                  activeKey={gender_voice}
                  tabs={[
                    {
                      key: "MALE",
                      label: "Male",
                    },
                    {
                      key: "FEMALE",
                      label: "Female",
                    },
                  ]}
                />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Col>
  );
};

const AlertsContainer = () => {
  const user = useSelector((state: any) => state.user);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<IAlertData>({ ...initAlertData });

  const getAlertsWidgetData = async (user: any) => {
    if (user.id) {
      const { data } = await axiosClient.get(
        "/api/widget/get-alerts-widget/" + user.id
      );
      const userData: IAlertData = {
        banner: {
          preview: data.banner_link ? `${url + data.banner_link}` : "",
          file: formData.banner.file,
        },
        message_color: data.message_color,
        name_color: data.name_color,
        sum_color: data.sum_color,
        duration: data.duration,
        sound: data.sound,
        voice: data.voice,
        gender_voice: data.gender_voice,
      };

      setFormData({
        ...formData,
        ...userData,
      });
    }
  };

  const sendData = async () => {
    try {
      setLoading(true);
      const {
        banner,
        message_color,
        name_color,
        sum_color,
        duration,
        sound,
        voice,
        gender_voice,
      } = formData;

      const form = new FormData();
      banner.file && form.append("file", banner.file);
      form.append(
        "alertData",
        JSON.stringify({
          message_color,
          name_color,
          sum_color,
          duration,
          sound,
          voice,
          gender_voice,
        })
      );
      form.append("creator_id", user.id);
      await axiosClient.put("/api/widget/edit-alerts-widget/", form);
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
      setLoading(false);
    }
  };

  useEffect(() => {
    getAlertsWidgetData(user);
  }, [user]);

  const linkForStream = useMemo(
    () => `${baseURL}/donat-message/${user.username}/${user.security_string}`,
    [user]
  );

  return (
    <div className="alerts-container">
      <PageTitle formatId="page_title_alerts" />
      <LinkCopy
        link={linkForStream}
        description={
          "Via the link below you can insert «New donation» widget on your stream"
        }
      />
      <div className="alertsSettings">
        <PageTitle formatId="page_title_design" />
        <WidgetMobileWrapper
          previewBlock={
            <PreviewAlertsBlock key="preview" formData={formData} />
          }
          settingsBlock={
            <SettingsAlertsBlock
              key="settings"
              formData={formData}
              setFormData={setFormData}
            />
          }
        />
        <div className="saveBottom">
          <BaseButton
            formatId="profile_form_save_changes_button"
            padding="6px 35px"
            onClick={sendData}
            fontSize="18px"
            disabled={loading}
            isBlue
          />
        </div>
      </div>
      {/* <ChromePicker color={color} onChangeComplete={handleChange} disableAlpha /> */}
    </div>
  );
};

export default AlertsContainer;
