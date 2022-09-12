import { useState } from "react";
import { Col, Progress, Row } from "antd";
import LinkCopy from "../../../components/LinkCopy";
import { PencilIcon, TrashBinIcon } from "../../../icons/icons";
import ColorPicker from "../../../components/ColorPicker";

const GoalItem = ({
  goalData,
  isArchive,
  setGoalData,
}: {
  goalData: any;
  isArchive?: boolean;
  setGoalData?: any;
}) => {
  const [isActiveDetails, setisActiveDetails] = useState(false);
  const handleActiveDetails = () =>
    !isArchive && setisActiveDetails(!isActiveDetails);

  const { goalTitleColor, progressBarColor, backgroundColor } = goalData;
  return (
    <>
      <div
        className="goals-item"
        style={{
          cursor: !isArchive ? "pointer" : "auto",
        }}
        onClick={handleActiveDetails}
      >
        <Row>
          <Col span={3}>
            <Progress
              type="circle"
              percent={75}
              width={83}
              strokeColor="#1D14FF"
              showInfo={false}
            />
          </Col>
          <Col span={21}>
            <Row
              style={{
                alignItems: "baseline",
                marginTop: 7,
              }}
            >
              <Col span={9}>
                <div className="goals-item__mainInfo">
                  <p className="goals-item__mainInfo_title">Buy a computer</p>
                  <p className="goals-item__mainInfo_description">
                    Raised: 100/1000 USD
                  </p>
                </div>
              </Col>
              <Col span={13}>
                {!isArchive && (
                  <div className="goals-item__link">
                    <LinkCopy
                      link={
                        "http://localhost:5000/donat-message/undefined/undefined"
                      }
                      isSimple
                    />
                  </div>
                )}
              </Col>
              <Col span={2}>
                <div className="goals-item__btns">
                  {!isArchive && (
                    <div
                      style={{
                        marginRight: 5,
                      }}
                    >
                      <PencilIcon />
                    </div>
                  )}
                  <div>
                    <TrashBinIcon />
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      {isActiveDetails && (
        <div className="goals-item__details">
          <Row gutter={[4, 4]} className="goals-item__details-container">
            <Col span={10}>
              <div className="preview-block">
                <div className="preview-block_title">
                  <p>
                    <span
                      style={{
                        color: goalTitleColor,
                      }}
                    >
                      Buy a computer
                    </span>
                  </p>
                </div>
                <div
                  className="preview-block_goal"
                  style={{
                    //   color: messageColor,
                    background: backgroundColor,
                  }}
                >
                  <Progress
                    type="circle"
                    percent={75}
                    width={46}
                    strokeColor={progressBarColor}
                    showInfo={false}
                  />

                  <p>100 / 1000 USD</p>
                </div>
              </div>
            </Col>
            <Col span={12} className="form">
              <div className="form-element">
                <ColorPicker
                  setColor={(color) =>
                    setGoalData({ ...goalData, goalTitleColor: color })
                  }
                  color={goalTitleColor}
                  label="Goal title color:"
                  labelCol={9}
                />
              </div>
              <div className="form-element">
                <ColorPicker
                  setColor={(color) =>
                    setGoalData({ ...goalData, progressBarColor: color })
                  }
                  color={progressBarColor}
                  label="Progress bar color:"
                  labelCol={9}
                />
              </div>
              <div className="form-element">
                <ColorPicker
                  setColor={(color) =>
                    setGoalData({ ...goalData, backgroundColor: color })
                  }
                  color={backgroundColor}
                  label="Background color:"
                  labelCol={9}
                />
              </div>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
};

export default GoalItem;
