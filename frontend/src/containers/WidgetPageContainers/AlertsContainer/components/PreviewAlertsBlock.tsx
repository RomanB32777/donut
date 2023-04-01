import { FC, memo } from "react";
import { Col } from "antd";
import { FormattedMessage } from "react-intl";

import { getFontColorStyles } from "utils";
import { dummyImg } from "consts";
import { IAlert } from "appTypes";

interface IPreviewAlertsBlock {
  formData: IAlert;
}

const PreviewAlertsBlock: FC<IPreviewAlertsBlock> = ({ formData }) => {
  const {
    banner,
    messageColor,
    messageFont,
    nameColor,
    nameFont,
    sumColor,
    sumFont,
  } = formData;

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
          <img src={banner.preview || dummyImg} alt="preview logo" />
        </div>

        <div className="preview-block_title">
          <p>
            <span style={getFontColorStyles(nameColor, nameFont)}>MrBeast</span>
            &nbsp;-&nbsp;
            <span style={getFontColorStyles(sumColor, sumFont)}>10 USD</span>
          </p>
        </div>
        <p className="preview-block_message">
          <span style={getFontColorStyles(messageColor, messageFont)}>
            <FormattedMessage id="alerts_preview_message" />
          </span>
        </p>
      </div>
    </Col>
  );
};

export default memo(PreviewAlertsBlock);
