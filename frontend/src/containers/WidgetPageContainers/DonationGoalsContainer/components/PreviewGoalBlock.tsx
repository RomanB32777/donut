import { Col, Progress } from "antd";
import useWindowDimensions from "hooks/useWindowDimensions";
import { IWidgetGoalData } from "appTypes";
import { getFontColorStyles } from "utils";

const PreviewGoalBlock = ({
  editGoalData,
  children,
}: {
  editGoalData: IWidgetGoalData;
  children?: React.ReactNode;
}) => {
  const { isLaptop } = useWindowDimensions();
  const {
    title,
    titleColor,
    progressColor,
    backgroundColor,
    titleFont,
    progressFont,
  } = editGoalData;

  return (
    <Col
      xl={10}
      md={24}
      style={{
        width: "100%",
      }}
    >
      <div className="preview-block">
        <div className="title">
          <p>
            <span style={getFontColorStyles(titleColor, titleFont)}>
              {title}
            </span>
          </p>
        </div>
        <div
          className="goal"
          style={{
            background: backgroundColor,
          }}
        >
          <Progress
            type="circle"
            percent={75}
            width={46}
            strokeColor={progressColor}
            format={(percent) => (
              <span
                style={{
                  color: "#fff",
                }}
              >
                {percent}%
              </span>
            )}
          />
          <p style={getFontColorStyles("#fff", progressFont)}>75 / 100 USD</p>
        </div>
      </div>
      {isLaptop && children}
    </Col>
  );
};

export default PreviewGoalBlock;
