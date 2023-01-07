import { Col, Row } from "antd";
import BaseButton from "components/BaseButton";
import ColorPicker from "components/ColorPicker";
import { IEditGoalData } from "appTypes";

const SettingsGoalBlock = ({
  editGoalData,
  loading,
  sendColorsData,
  setEditGoalData,
}: {
  editGoalData: IEditGoalData;
  loading: boolean;
  sendColorsData: () => Promise<void>;
  setEditGoalData: (editGoalData: IEditGoalData) => void;
}) => {
  const { title_color, progress_color, background_color } = editGoalData;

  return (
    <Col xl={13} md={24}>
      <Row gutter={[0, 18]} className="form">
        <Col span={24}>
          <div className="form-element">
            <ColorPicker
              setColor={(color) =>
                setEditGoalData({ ...editGoalData, title_color: color })
              }
              color={title_color}
              label="Goal title color:"
              labelCol={9}
              gutter={[0, 18]}
            />
          </div>
        </Col>
        <Col span={24}>
          <div className="form-element">
            <ColorPicker
              setColor={(color) =>
                setEditGoalData({ ...editGoalData, progress_color: color })
              }
              color={progress_color}
              label="Progress bar color:"
              labelCol={9}
              gutter={[0, 18]}
            />
          </div>
        </Col>
        <Col span={24}>
          <div className="form-element">
            <ColorPicker
              setColor={(color) =>
                setEditGoalData({
                  ...editGoalData,
                  background_color: color,
                })
              }
              color={background_color}
              label="Background color:"
              labelCol={9}
              gutter={[0, 18]}
            />
          </div>
        </Col>
      </Row>
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
    </Col>
  );
};

export default SettingsGoalBlock;
