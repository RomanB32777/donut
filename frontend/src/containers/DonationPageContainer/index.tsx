import { Col, Row } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import QRCode from "react-qr-code";
import clsx from "clsx";

import axiosClient, { baseURL } from "../../axiosClient";
import BaseButton from "../../components/BaseButton";
import PageTitle from "../../components/PageTitle";
import ColorPicker from "../../components/ColorPicker";
import LinkCopy from "../../components/LinkCopy";
import UploadImage from "../../components/UploadImage";
import FormInput from "../../components/FormInput";
import { SmallToggleListArrowIcon } from "../../icons/icons";
import { IFileInfo } from "../../types";
import { addNotification, addSuccessNotification, sendFile } from "../../utils";
import { tryToGetUser } from "../../store/types/User";
import { url } from "../../consts";
import "./styles.sass";

interface IDonationInfoData {
  avatar: IFileInfo;
  banner: IFileInfo;
  welcome_text: string;
  btn_text: string;
  main_color: string;
  background_color: string;
}

const DonationPageContainer = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const [donationInfoData, setDonationInfoData] = useState<IDonationInfoData>({
    avatar: {
      preview: "",
      file: null,
    },
    banner: {
      preview: "",
      file: null,
    },
    welcome_text: "",
    btn_text: "",
    main_color: "#ffffff",
    background_color: "#ffffff",
  });

  const [isOpenQR, setIsOpenQR] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const onImageDownload = () => {
    const svg = document.getElementById("QRCode");
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx && ctx.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = "QRCode";
        downloadLink.href = `${pngFile}`;
        downloadLink.click();
      };
      img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
    }
  };

  const sendData = async () => {
    try {
      setLoading(true);
      const walletKey = process.env.REACT_APP_WALLET || "metamask";
      const {
        avatar,
        banner,
        welcome_text,
        btn_text,
        main_color,
        background_color,
      } = donationInfoData;
      await axiosClient.put("/api/user/edit/", {
        welcome_text,
        btn_text,
        main_color,
        background_color,
        user_id: user.id,
      });
      avatar.file &&
        (await sendFile(avatar.file, user, "/api/user/edit-image/"));
      banner.file &&
        (await sendFile(banner.file, user, "/api/user/edit-background/"));
      dispatch(tryToGetUser(user[`${walletKey}_token`]));
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
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.id) {
      const userData: IDonationInfoData = {
        avatar: {
          preview: user.avatarlink ? `${url + user.avatarlink}` : "",
          file: donationInfoData.avatar.file,
        },
        banner: {
          preview: user.backgroundlink ? `${url + user.backgroundlink}` : "",
          file: donationInfoData.banner.file,
        },
        welcome_text: user.welcome_text,
        btn_text: user.btn_text,
        main_color: user.main_color,
        background_color: user.background_color,
      };

      setDonationInfoData({
        ...donationInfoData,
        ...userData,
      });
    }
  }, [user]);

  const linkForSupport = useMemo(
    () => baseURL + "/support/" + user.username, //+ "/" + user.security_string,
    [user]
  );

  const {
    avatar,
    banner,
    welcome_text,
    btn_text,
    main_color,
    background_color,
  } = donationInfoData;

  return (
    <div className="donationPage-container">
      <PageTitle formatId="page_title_donation_page" />
      <LinkCopy
        link={linkForSupport}
        description={
          "Via the link below your supporters can send you donations"
        }
      />
      <div className="qr">
        <div
          className="qr-title"
          onClick={() => {
            setIsOpenQR(!isOpenQR);
          }}
        >
          <span>Generate QR code</span>
          <div
            className={clsx("icon", {
              rotated: isOpenQR,
            })}
          >
            <SmallToggleListArrowIcon />
          </div>
        </div>
        {isOpenQR && (
          <div className="qr-wrapper">
            <div className="qr-block">
              <QRCode id="QRCode" size={125} value={linkForSupport} />
            </div>
            <BaseButton
              formatId="profile_form_download_png_button"
              padding="6px 26px"
              onClick={onImageDownload}
              fontSize="18px"
              isBlue
            />
          </div>
        )}
      </div>
      <div className="designSettings">
        <PageTitle formatId="page_title_design" />
        <Row gutter={[0, 18]} className="form">
          <Col span={24}>
            <div className="form-element">
              <UploadImage
                label="Avatar:"
                formats={["PNG", "JPG", "JPEG", "GIF"]}
                filePreview={avatar.preview}
                setFile={({ preview, file }) =>
                  setDonationInfoData({
                    ...donationInfoData,
                    avatar: {
                      file,
                      preview,
                    },
                  })
                }
                labelCol={8}
                InputCol={16}
              />
            </div>
          </Col>

          <Col span={24}>
            <div className="form-element">
              <UploadImage
                label="Banner:"
                formats={["PNG", "JPG", "JPEG"]}
                filePreview={banner.preview}
                setFile={({ preview, file }) =>
                  setDonationInfoData({
                    ...donationInfoData,
                    banner: {
                      file,
                      preview,
                    },
                  })
                }
                labelCol={8}
                InputCol={16}
                isBanner
              />
            </div>
          </Col>
          <Col span={24}>
            <div className="form-element">
              <FormInput
                label="Welcome text:"
                name="welcomeText"
                value={welcome_text}
                setValue={(value) =>
                  setDonationInfoData({
                    ...donationInfoData,
                    welcome_text: value,
                  })
                }
                labelCol={8}
                InputCol={16}
                gutter={[0, 16]}
                isTextarea
              />
            </div>
          </Col>
          <Col span={24}>
            <div className="form-element">
              <FormInput
                label="Button text:"
                name="buttonText"
                value={btn_text}
                setValue={(value) =>
                  setDonationInfoData({
                    ...donationInfoData,
                    btn_text: value,
                  })
                }
                labelCol={8}
                InputCol={10}
                gutter={[0, 16]}
              />
            </div>
          </Col>
          <Col span={24}>
            <div className="form-element">
              <ColorPicker
                color={main_color}
                label="Main color:"
                setColor={(value) =>
                  setDonationInfoData({
                    ...donationInfoData,
                    main_color: value,
                  })
                }
                labelCol={8}
                gutter={[0, 16]}
              />
            </div>
          </Col>
          <Col span={24}>
            <div className="form-element">
              <ColorPicker
                color={background_color}
                label="Background color:"
                setColor={(value) =>
                  setDonationInfoData({
                    ...donationInfoData,
                    background_color: value,
                  })
                }
                labelCol={8}
                gutter={[0, 16]}
              />
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
    </div>
  );
};

export default DonationPageContainer;
