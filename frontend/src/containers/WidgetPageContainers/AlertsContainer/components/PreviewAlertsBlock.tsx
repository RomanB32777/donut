import { FC, memo } from "react";
import { Col } from "antd";
import { getFontColorStyles } from "utils";
import { dummyImg } from "consts";
import { IAlert } from "appTypes";

interface IPreviewAlertsBlock {
  formData: IAlert;
}

const PreviewAlertsBlock: FC<IPreviewAlertsBlock> = ({ formData }) => {
  const {
    banner,
    message_color,
    message_font,
    name_color,
    name_font,
    sum_color,
    sum_font,
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
            <span style={getFontColorStyles(name_color, name_font)}>
              MrBeast
            </span>
            &nbsp;-&nbsp;
            <span style={getFontColorStyles(sum_color, sum_font)}>10 USD</span>
          </p>
        </div>
        <p className="preview-block_message">
          <span style={getFontColorStyles(message_color, message_font)}>
            Thank you for your stream!
          </span>
        </p>
      </div>
    </Col>
  );
};

export default memo(PreviewAlertsBlock);
