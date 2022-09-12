import { useEffect, useMemo, useState } from "react";
// import { ChromePicker } from "react-color";
import { Col, Row, Switch, Slider } from "antd";

import { useSelector } from "react-redux";
import { baseURL } from "../../axiosClient";
import PageTitle from "../../commonComponents/PageTitle";
import { addNotification, DateFormatter } from "../../utils";
import ColorPicker from "../../components/ColorPicker";
import UploadImage from "../../components/UploadImage";
import donImg from "../../assets/big_don.png";
import BlueButton from "../../commonComponents/BlueButton";
import LinkCopy from "../../components/LinkCopy";
import "./styles.sass";
import SelectComponent from "../../components/SelectComponent";

const soundsList = ["money.mp4", "fanfan.mp4", "cash.mp4"];

interface IAlertData {
  messageColor: string;
  donorNameColor: string;
  donationSumColor: string;
  durationSec: number;
  sound: string;
}

const AlertsContainer = () => {
  const user = useSelector((state: any) => state.user);
  // const dispatch = useDispatch();
  // const notifications = useSelector((state: any) => state.notifications);

  const [permissionsNotif, setPermissionsNotif] = useState(false);

  // useEffect(() => {
  //   if (user.id) {
  //     dispatch(getNotifications(user.id));
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [user]);

  useEffect(() => {
    if ("Notification" in window) {
      const storagePermission = localStorage.getItem("permissionsNotif");
      if (storagePermission) {
        storagePermission === "true"
          ? setPermissionsNotif(true)
          : setPermissionsNotif(false);
      } else
        Notification.permission === "granted"
          ? setPermissionsNotif(true)
          : setPermissionsNotif(false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("permissionsNotif", String(permissionsNotif));
  }, [permissionsNotif]);

  const linkForStream = useMemo(
    () =>
      baseURL + "/donat-message/" + user.username + "/" + user.security_string,
    [user]
  );

  const [file, setFile] = useState<any>();
  const [imgPreview, setImgPreview] = useState<any>("");

  const [formData, setFormData] = useState<IAlertData>({
    messageColor: "#ffffff",
    donorNameColor: "#ffffff",
    donationSumColor: "#ffffff",
    durationSec: 5,
    sound: soundsList[0],
  });

  const { messageColor, donorNameColor, donationSumColor, durationSec, sound } =
    formData;

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
        <Row gutter={[4, 4]} className="alertsSettings-container">
          <Col span={10}>
            <div className="preview-block">
              <div className="preview-block_img">
                <img src={imgPreview || donImg} alt="preview logo" />
              </div>
              <div className="preview-block_title">
                <p>
                  <span
                    style={{
                      color: donorNameColor,
                    }}
                  >
                    MrBeast
                  </span>{" "}
                  -{" "}
                  <span
                    style={{
                      color: donationSumColor,
                    }}
                  >
                    10 NEAR
                  </span>
                </p>
              </div>
              <p
                className="preview-block_message"
                style={{
                  color: messageColor,
                }}
              >
                Thank you for your stream!
              </p>
            </div>
          </Col>
          <Col span={12} className="form">
            <div className="form-element">
              <UploadImage
                label="Banner:"
                formats={["PNG", "JPG", "JPEG", "GIF"]}
                imgPreview={imgPreview}
                setImgPreview={setImgPreview}
                setFile={setFile}
              />
            </div>
            <div className="form-element">
              <ColorPicker
                setColor={(color) =>
                  setFormData({ ...formData, messageColor: color })
                }
                color={messageColor}
                label="Message color:"
              />
            </div>
            <div className="form-element">
              <ColorPicker
                setColor={(color) =>
                  setFormData({ ...formData, donorNameColor: color })
                }
                color={donorNameColor}
                label="Donor name color:"
              />
            </div>
            <div className="form-element">
              <ColorPicker
                setColor={(color) =>
                  setFormData({ ...formData, donationSumColor: color })
                }
                color={donationSumColor}
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
                        setFormData({ ...formData, durationSec: num })
                      }
                      value={durationSec}
                      max={15}
                      min={3}
                    />
                    <span>{durationSec} sec</span>
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
                <Col span={12}>
                  <SelectComponent
                    title={sound}
                    list={soundsList}
                    selectItem={(selected) =>
                      setFormData({ ...formData, sound: selected })
                    }
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
                    <Switch id="voiceSwitch" defaultChecked />
                    <span>Abled</span>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        <div className="saveBottom">
          <BlueButton
            formatId="profile_form_save_changes_button"
            padding="6px 35px"
            onClick={() => console.log("dd")}
            fontSize="18px"
          />
        </div>
      </div>
      {/* <ChromePicker color={color} onChangeComplete={handleChange} disableAlpha /> */}
    </div>
  );
};

export default AlertsContainer;
