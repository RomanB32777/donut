import { useEffect, useMemo, useState } from "react";
// import { ChromePicker } from "react-color";
import { Col, Row, Switch, Slider } from "antd";
import { useSelector } from "react-redux";
import useSound from "use-sound";

import axiosClient, { baseURL } from "../../axiosClient";
import PageTitle from "../../commonComponents/PageTitle";
import {
  addNotification,
  addSuccessNotification,
} from "../../utils";
import ColorPicker from "../../components/ColorPicker";
import UploadImage from "../../components/UploadImage";
import donImg from "../../assets/big_don.png";
import BaseButton from "../../commonComponents/BaseButton";
import LinkCopy from "../../components/LinkCopy";
import SelectComponent from "../../components/SelectComponent";
import { IAlertData, IFileInfo } from "../../types";
import { url } from "../../consts";
import { soundsList } from "../../assets/sounds";
import "./styles.sass";

const AlertsContainer = () => {
  const user = useSelector((state: any) => state.user);

  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<IAlertData>({
    banner: {
      preview: "",
      file: null,
    },
    message_color: "#ffffff",
    name_color: "#ffffff",
    sum_color: "#ffffff",
    duration: 5,
    sound: "sound_1",
    voice: false,
  });

  const getAlertsWidgetData = async (user: any) => {
    if (user.id) {
      const { data } = await axiosClient.get(
        "/api/user/get-alerts-widget/" + user.id
      );
      console.log(data);
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
        })
      );
      form.append("creator_id", user.id);
      await axiosClient.put("/api/user/edit-alerts-widget/", form);
      addSuccessNotification("Data saved successfully");
    } catch (error) {
      addNotification({
        type: "danger",
        title: "Error",
        message: `An error occurred while saving data`,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAlertsWidgetData(user);
  }, [user]);

  const linkForStream = useMemo(
    () =>
      baseURL + "/donat-message/" + user.username + "/" + user.security_string,
    [user]
  );

  const { banner, message_color, name_color, sum_color, duration, sound } =
    formData;

  const [play, { stop }] = useSound(soundsList[sound]);

  // console.log(soundsList[sound]);
  
  useEffect(() => {
    console.log(" stop();");
  }, [sound]);

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
        <Row
          gutter={[4, 4]}
          className="alertsSettings-container"
          justify="space-between"
        >
          <Col span={10}>
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
          <Col span={13} className="form">
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
            <div className="form-element">
              <ColorPicker
                setColor={(color) =>
                  setFormData({ ...formData, message_color: color })
                }
                color={message_color}
                label="Message color:"
              />
            </div>
            <div className="form-element">
              <ColorPicker
                setColor={(color) =>
                  setFormData({ ...formData, name_color: color })
                }
                color={name_color}
                label="Donor name color:"
              />
            </div>
            <div className="form-element">
              <ColorPicker
                setColor={(color) =>
                  setFormData({ ...formData, sum_color: color })
                }
                color={sum_color}
                label="Donation sum color:"
              />
            </div>
            <div className="form-element">
              <Row
                style={{
                  width: "100%",
                }}
              >
                <Col span={12}>
                  <span className="form-element__label">Alert duration:</span>
                </Col>
                <Col span={12}>
                  <div className="durationSlider">
                    <Slider
                      onChange={(num) =>
                        setFormData({ ...formData, duration: num })
                      }
                      value={duration}
                      max={15}
                      min={3}
                    />
                    <span>{duration} sec</span>
                  </div>
                </Col>
              </Row>
            </div>
            <div className="form-element">
              <Row
                style={{
                  width: "100%",
                }}
              >
                <Col span={12}>
                  <span className="form-element__label">Alert sound:</span>
                </Col>
                <Col span={4}>
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
            <div className="form-element">
              <Row
                style={{
                  width: "100%",
                }}
              >
                <Col span={12}>
                  <span className="form-element__label">Voice alerts:</span>
                </Col>
                <Col span={12}>
                  <div className="voiceSwitch-wrapper">
                    <span>Disabled</span>
                    <Switch
                      id="voiceSwitch"
                      onChange={(flag) =>
                        setFormData({ ...formData, voice: flag })
                      }
                    />
                    <span>Abled</span>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
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
