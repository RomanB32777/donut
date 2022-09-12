import { Col, Row } from "antd";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import QRCode from "react-qr-code";
import clsx from "clsx";

import { baseURL } from "../../axiosClient";
import BlueButton from "../../commonComponents/BlueButton";
import PageTitle from "../../commonComponents/PageTitle";
import ColorPicker from "../../components/ColorPicker";
import LinkCopy from "../../components/LinkCopy";
import UploadImage from "../../components/UploadImage";
import FormInput from "../../components/FormInput";
import { SmallToggleListArrowIcon } from "../../icons/icons";

import "./styles.sass";

const DonationPageContainer = () => {
  const user = useSelector((state: any) => state.user);

  const [file, setFile] = useState<any>();
  const [imgPreview, setImgPreview] = useState<any>("");
  const [mainColor, setMainColor] = useState("#ffffff");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [welcomeText, setWelcomeText] = useState("");
  const [buttonText, setButtonText] = useState("");

  const [isOpenQR, setIsOpenQR] = useState<boolean>(false);

  const onImageCownload = () => {
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

  const linkForSupport = useMemo(
    () => baseURL + "/donat/" + user.username + "/" + user.security_string,
    [user]
  );

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
            <BlueButton
              formatId="profile_form_download_png_button"
              padding="6px 26px"
              onClick={onImageCownload}
              fontSize="18px"
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
                label="Banner:"
                formats={["PNG", "JPG", "JPEG"]}
                imgPreview={imgPreview}
                setImgPreview={setImgPreview}
                setFile={setFile}
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
                value={welcomeText}
                setValue={(value) => setWelcomeText(value)}
                labelCol={8}
                InputCol={16}
                isTextarea
              />
            </div>
          </Col>
          <Col span={24}>
            <div className="form-element">
              <FormInput
                label="Button text:"
                name="buttonText"
                value={buttonText}
                setValue={(value) => setButtonText(value)}
                labelCol={8}
                InputCol={10}
              />
            </div>
          </Col>
          <Col span={24}>
            <div className="form-element">
              <ColorPicker
                setColor={setMainColor}
                color={mainColor}
                label="Main color:"
                labelCol={8}
              />
            </div>
          </Col>
          <Col span={24}>
            <div className="form-element">
              <ColorPicker
                setColor={setBackgroundColor}
                color={backgroundColor}
                label="Background color:"
                labelCol={8}
              />
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
    </div>
  );
};

export default DonationPageContainer;
