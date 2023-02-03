import { useMemo, useState } from "react";
import { Col, Row, RowProps } from "antd";
import clsx from "clsx";
import { UploadIcon, TrashBinIcon } from "icons";
import { addNotification } from "utils";
import { IFileInfo } from "appTypes";
import "./styles.sass";

export const UploadAfterEl = ({
  size,
  mdCol = 8,
  alsoText = "Or choose",
  openBanners,
}: {
  size: string;
  mdCol?: number;
  alsoText?: string;
  openBanners: () => void;
}) => (
  <Col md={mdCol} xs={24}>
    <div className="upload-afterEl">
      <p>Recommended size: {size} px</p>
      <p>
        {alsoText}&nbsp;
        <span className="link" onClick={() => openBanners()}>
          default banners
        </span>
      </p>
    </div>
  </Col>
);

const UploadImage = ({
  imgName,
  label,
  formats,
  disabled,
  setFile,
  filePreview,
  maxFileSize = 3, // MB
  inputCol,
  labelCol,
  gutter,
  rowProps,
  bigSize,
  afterEl,
  isBanner,
  isWithClearIcon,
}: {
  imgName?: string;
  label: string;
  formats?: string[];
  disabled?: boolean;
  filePreview?: string;
  maxFileSize?: number;
  inputCol?: number;
  labelCol?: number;
  gutter?: number | [number, number];
  rowProps?: RowProps;
  bigSize?: boolean;
  isBanner?: boolean;
  afterEl?: React.ReactNode;
  isWithClearIcon?: boolean;
  setFile?: (fileInfo: IFileInfo) => void;
}) => {
  const [isMouseOnAvatar, setIsMouseOnAvatar] = useState<boolean>(false);

  const fileToBase64 = (file: File) => {
    if (setFile) {
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () =>
          setFile({ file, preview: (reader.result as string) || "" });
        reader.onerror = (error) => reject(error);
      });
    }
  };

  const saveFile = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const maxFileSizeInBytes = maxFileSize * 1024 * 1024;
    if (ev.target.files && ev.target.files[0].size <= maxFileSizeInBytes) {
      fileToBase64(ev.target.files[0]);
    } else {
      addNotification({
        type: "danger",
        title: `File size limit exceeded (max - ${maxFileSize} MB)`,
      });
    }
  };

  const clear = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setFile && setFile({ file: null, preview: "" });
  };

  const imgExist = useMemo(
    () => filePreview || (imgName && imgName.length > 0),
    [filePreview, imgName]
  );

  return (
    <div className="file-input">
      <Row
        gutter={gutter || 0}
        style={{
          width: "100%",
        }}
        justify={afterEl ? "space-between" : "start"}
        {...rowProps}
      >
        <Col md={labelCol || 12} xs={24}>
          <div className="text">
            <p className="title">{label}</p>
            {formats?.length && !disabled && (
              <p
                className="formats"
                style={{
                  maxWidth: maxFileSize && "none",
                }}
              >
                You can use formats: {formats.join(", ")}
                {maxFileSize && <span>. Max size: {maxFileSize} MB</span>}
              </p>
            )}
          </div>
        </Col>
        <Col md={inputCol || 12} xs={24}>
          <div
            className={clsx("row", {
              banner: isBanner,
              bigSize,
              transparent: Boolean(filePreview?.length),
            })}
            onMouseEnter={() => !disabled && setIsMouseOnAvatar(true)}
            onMouseLeave={() => !disabled && setIsMouseOnAvatar(false)}
          >
            <div className="image">
              {imgExist && (
                <div className="content">
                  <img src={filePreview || imgName} alt={label} />
                </div>
              )}
            </div>
            {!disabled && (
              <div className="button">
                <input
                  type="file"
                  onChange={saveFile}
                  accept={
                    formats?.map((f) => `image/${f.toLowerCase()}`).join(",") ||
                    "image/jpeg,image/jpg,image/png"
                  }
                />
                <div
                  className={clsx("back", { bigSize })}
                  style={{
                    opacity: isMouseOnAvatar || !imgExist ? "1" : "0",
                  }}
                >
                  <UploadIcon />
                  {isWithClearIcon && imgExist && (
                    <div className="clear-icon" onClick={clear}>
                      <TrashBinIcon />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </Col>
        {afterEl}
      </Row>
    </div>
  );
};

export default UploadImage;
