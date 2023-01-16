import { Col, Progress } from "antd";

import BaseButton from "components/BaseButton";

import useWindowDimensions from "hooks/useWindowDimensions";
import { IWidgetGoalData } from "appTypes";
import { getFontColorStyles } from "utils";

const PreviewGoalBlock = ({
  loading,
  editGoalData,
  editWidgetData,
}: {
  loading: boolean;
  editGoalData: IWidgetGoalData;
  editWidgetData: () => Promise<void>;
}) => {
  const { isLaptop } = useWindowDimensions();
  const {
    title,
    title_color,
    progress_color,
    background_color,
    title_font,
    progress_font,
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
        <div className="preview-block_title">
          <p>
            <span style={getFontColorStyles(title_color, title_font)}>
              {title}
            </span>
          </p>
        </div>
        <div
          className="preview-block_goal"
          style={{
            background: background_color,
          }}
        >
          <Progress
            type="circle"
            percent={75}
            width={46}
            strokeColor={progress_color}
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
          <p style={getFontColorStyles("#fff", progress_font)}>75 / 100 USD</p>
        </div>
      </div>
      {isLaptop && (
        <div className="btn-block">
          <BaseButton
            formatId="profile_form_save_changes_button"
            padding="6px 35px"
            onClick={editWidgetData}
            fontSize="18px"
            disabled={loading}
            isMain
          />
        </div>
      )}
    </Col>
  );
};

export default PreviewGoalBlock;
