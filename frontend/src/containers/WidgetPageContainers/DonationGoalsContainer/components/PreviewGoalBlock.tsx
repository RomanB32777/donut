import { Col, Progress } from "antd";
import { IGoalData } from "types";
import BaseButton from "components/BaseButton";
import useWindowDimensions from "hooks/useWindowDimensions";
import { IEditGoalData } from "appTypes";

const PreviewGoalBlock = ({
  editGoalData,
  goalData,
  loading,
  sendColorsData,
}: {
  editGoalData: IEditGoalData;
  goalData: IGoalData;
  loading: boolean;
  sendColorsData: () => Promise<void>;
}) => {
  const { isLaptop } = useWindowDimensions();
  const { title } = goalData;
  const { title_color, progress_color, background_color } = editGoalData;

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
            <span
              style={{
                color: title_color,
              }}
            >
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

          <p>75 / 100 USD</p>
        </div>
      </div>
      {isLaptop && (
        <div className="btn-block">
          <BaseButton
            formatId="profile_form_save_changes_button"
            padding="6px 35px"
            onClick={sendColorsData}
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
