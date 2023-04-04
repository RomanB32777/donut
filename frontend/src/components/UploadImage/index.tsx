import { useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Col, Row, RowProps } from "antd";
import clsx from "clsx";

import { UploadIcon, TrashBinIcon } from "icons";
import { addNotification } from "utils";
import { IFileInfo } from "appTypes";
import "./styles.sass";

export const UploadAfterEl = ({
  size,
  mdCol = 8,
  alsoText,
  openBanners,
}: {
  size: string;
  mdCol?: number;
  alsoText: React.ReactNode;
  openBanners: () => void;
}) => (
  <Col md={mdCol} xs={24}>
    <div className="upload-afterEl">
      <p>
        <FormattedMessage id="upload_recommended_size" values={{ size }} />
      </p>
      <p>
        {alsoText}&nbsp;
        <span className="link" onClick={() => openBanners()}>
          <FormattedMessage id="upload_default_banners" />
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
  label: React.ReactNode;
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
        title: (
          <FormattedMessage
            id="notification_file_limit_exceeded"
            values={{ maxFileSize }}
          />
        ),
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
                <FormattedMessage
                  id="upload_formats"
                  values={{ formats: formats.join(", ") }}
                />
                {maxFileSize && (
                  <span>
                    <FormattedMessage
                      id="upload_max_size"
                      values={{ maxFileSize }}
                    />
                  </span>
                )}
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
                  <img src={filePreview || imgName} alt={imgName} />
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
