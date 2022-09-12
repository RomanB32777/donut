import { useMemo, useState } from "react";
import { Col, Row } from "antd";
import { UploadIcon } from "../../icons/icons";
import { url } from "../../consts";
import clsx from "clsx";
import "./styles.sass";

const UploadImage = ({
  imgName,
  label,
  formats,
  setFile,
  imgPreview,
  setImgPreview,
  InputCol,
  labelCol,
  isBanner,
}: {
  imgName?: string;
  label: string;
  formats?: string[];
  setFile: any;
  imgPreview: any;
  setImgPreview: any;
  InputCol?: number;
  labelCol?: number;
  isBanner?: boolean;
}) => {
  const [isMouseOnAvatar, setIsMouseOnAvatar] = useState<boolean>(false);

  const fileToBase64 = (file: any) => {
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => setImgPreview(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const saveFile = (ev: any) => {
    if (ev.target.files[0].size <= 3 * 1024 * 1024) {
      setFile(ev.target.files[0]);
      fileToBase64(ev.target.files[0]);
      // setFileName(ev.target.files[0].name);
    }
  };

  const imgExist = useMemo(
    () =>
      (imgPreview && imgPreview.length > 0) || (imgName && imgName.length > 0),
    [imgPreview, imgName]
  );

  return (
    <div className="file-input">
      <Row
        style={{
          width: "100%",
        }}
      >
        <Col span={labelCol || 12}>
          <div className="file-input__texts">
            <p className="file-input__title">{label}</p>
            {formats?.length && (
              <p className="file-input__formats">
                You can use formats: {formats.join(", ")}
              </p>
            )}
          </div>
        </Col>
        <Col span={InputCol || 12}>
          <div
            className={clsx("file-input__row", {
              banner: isBanner,
            })}
            onMouseEnter={() => setIsMouseOnAvatar(true)}
            onMouseLeave={() => setIsMouseOnAvatar(false)}
          >
            <div className="file-input__row__image">
              {imgExist && (
                <img src={imgPreview || url + imgName} alt="avatar" />
              )}
            </div>
            <div className="file-input__row__button">
              <input
                type="file"
                onChange={saveFile}
                accept={
                  formats?.map((f) => `image/${f.toLowerCase()}`).join(",") ||
                  "image/jpeg,image/jpg,image/png"
                }
              />
              <div
                className="file-input__row__back"
                style={{
                  opacity: isMouseOnAvatar || !imgExist ? "1" : "0",
                }}
              >
                <UploadIcon />
                {/* <span>600x600px</span> */}
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default UploadImage;
