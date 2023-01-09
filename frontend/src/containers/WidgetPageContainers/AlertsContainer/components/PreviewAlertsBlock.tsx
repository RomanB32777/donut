import { Col } from "antd";
import StyledText from "components/StyledText";
import { dummyImg } from "consts";
import { IAlert } from "appTypes";

const PreviewAlertsBlock = ({ formData }: { formData: IAlert }) => {
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
            <StyledText
              color={name_color}
              font={name_font.name}
              fontLink={name_font.link}
            >
              MrBeast
            </StyledText>
            &nbsp; -&nbsp;
            <StyledText
              color={sum_color}
              font={sum_font.name}
              fontLink={sum_font.link}
            >
              10 USD
            </StyledText>
          </p>
        </div>
        <p className="preview-block_message">
          <StyledText
            color={message_color}
            font={message_font.name}
            fontLink={message_font.link}
          >
            Thank you for your stream!
          </StyledText>
        </p>
      </div>
    </Col>
  );
};

export default PreviewAlertsBlock;
