import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, Progress, Row } from "antd";
import clsx from "clsx";
import LinkCopy from "../../../components/LinkCopy";
import { PencilIcon, TrashBinIcon } from "../../../icons/icons";
import ColorPicker from "../../../components/ColorPicker";
import ConfirmPopup from "../../../components/ConfirmPopup";
import BaseButton from "../../../commonComponents/BaseButton";
import axiosClient, { baseURL } from "../../../axiosClient";
import {
  alignFlextItemsList,
  alignItemsList,
  AlignText,
  IStatData,
  typeAligmnet,
} from "../../../types";
import {
  addNotification,
  addSuccessNotification,
  renderStatItem,
} from "../../../utils";
import { getStats } from "../../../store/types/Stats";
import { SliderMarks } from "antd/lib/slider";
import SliderForm from "../../../components/SliderForm";

const marksSlider: { [key: number]: typeAligmnet } = {
  0: "Left",
  1: "Center",
  2: "Right",
};

interface IEditStatData {
  title_color: string;
  bar_color: string;
  content_color: string;
  aligment: typeAligmnet;
}

const StatsItem = ({
  statData,
  openEditModal,
}: {
  statData: IStatData;
  openEditModal?: (data: IStatData) => void;
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);

  const [isActiveDetails, setisActiveDetails] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [editStatData, setEditStatData] = useState<IEditStatData>({
    title_color: "#ffffff",
    bar_color: "#1D14FF",
    content_color: "#212127",
    aligment: "Center",
  });

  const handleActiveDetails = () => setisActiveDetails(!isActiveDetails);

  const clickEditBtn = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    openEditModal && openEditModal(statData);
  };

  const sendColorsData = async () => {
    try {
      setLoading(true);
      const { id } = statData;
      const { title_color, bar_color, content_color, aligment } = editStatData;
      await axiosClient.put("/api/user/stats-widget/", {
        statData: {
          title_color,
          bar_color,
          content_color,
          aligment,
        },
        id,
      });
      dispatch(getStats(user.id));
      addSuccessNotification("Data saved successfully");
    } catch (error) {
      addNotification({
        type: "danger",
        title: "Error",
        message:
          (error as any)?.response?.data?.message ||
          `An error occurred while saving data`,
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteGoalWidget = async () => {
    try {
      setLoading(true);
      const { id } = statData;
      await axiosClient.delete("/api/user/stats-widget/" + id);
      dispatch(getStats(user.id));
      addSuccessNotification("Widget deleted successfully");
    } catch (error) {
      addNotification({
        type: "danger",
        title: "Error",
        message:
          (error as any)?.response?.data?.message ||
          `An error occurred while deleting data`,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const { title_color, bar_color, content_color, aligment } = statData;
    setEditStatData({
      title_color,
      bar_color,
      content_color,
      aligment,
    });
  }, []);

  const { id, title, stat_description, template, data_type, time_period } =
    statData;
  const { title_color, bar_color, content_color, aligment } = editStatData;

  const valueSlider = useMemo(
    () =>
      Object.keys(marksSlider).find((key) => marksSlider[+key] === aligment),
    [aligment]
  );

  return (
    <>
      <div
        className={clsx("stats-item", {
          active: isActiveDetails,
        })}
        onClick={handleActiveDetails}
      >
        <Row>
          <Col span={11}>
            <div className="stats-item__mainInfo">
              <p className="stats-item__mainInfo_title">{title}</p>
              <p className="stats-item__mainInfo_description">
                {stat_description}
              </p>
            </div>
          </Col>
          <Col span={12}>
            <div className="stats-item__parameters">
              <p>Date period: {time_period} </p>
              {/* 01/08/2022 - 31/08/2022 */}
              <p>Date type: {data_type}</p>
              <p>Template: {template}</p>
              <LinkCopy
                link={baseURL + "/donat-stat/" + user.username + "/" + id}
                isSimple
              />
            </div>
          </Col>
          <Col span={1}>
            <div className="stats-item__btns">
              <div
                style={{
                  marginRight: 5,
                }}
                onClick={clickEditBtn}
              >
                <PencilIcon />
              </div>
              <ConfirmPopup confirm={deleteGoalWidget}>
                <div style={{ marginLeft: 5 }}>
                  <TrashBinIcon />
                </div>
              </ConfirmPopup>
            </div>
          </Col>
        </Row>
      </div>
      {isActiveDetails && (
        <div className="stats-item__details">
          <Row
            gutter={[4, 4]}
            className="stats-item__details-container"
            justify="space-between"
          >
            <Col span={10}>
              <div className="preview-block">
                <span
                  className="preview-block_title"
                  style={{
                    background: bar_color,
                    color: title_color,
                  }}
                >
                  {data_type} {time_period.toLowerCase()}
                </span>
                <div
                  className="preview-block_stat"
                  style={{
                    justifyContent: alignFlextItemsList[aligment],
                  }}
                >
                  <div className="preview-block_stat__list">
                    <p
                      className="preview-block_stat__list-item"
                      style={{
                        color: content_color,
                        textAlign:
                          (alignItemsList[aligment] as AlignText) || "center",
                      }}
                    >
                      {renderStatItem(
                        template,
                        {
                          username: "Jordan",
                          sum_donation: "30 USD",
                          donation_message: "Hello! This is test message",
                        },
                        2.7
                      )}
                    </p>
                    <p
                      className="preview-block_stat__list-item"
                      style={{
                        color: content_color,
                        textAlign:
                          (alignItemsList[aligment] as AlignText) || "center",
                      }}
                    >
                      {renderStatItem(
                        template,
                        {
                          username: "Nate",
                          sum_donation: "50 USD",
                          donation_message: "How are you ?",
                        },
                        2.7
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </Col>
            <Col span={13} className="form">
              <div className="form-element">
                <ColorPicker
                  setColor={(color) =>
                    setEditStatData({ ...editStatData, title_color: color })
                  }
                  color={title_color}
                  label="Goal title color:"
                  labelCol={10}
                />
              </div>
              <div className="form-element">
                <ColorPicker
                  setColor={(color) =>
                    setEditStatData({ ...editStatData, bar_color: color })
                  }
                  color={bar_color}
                  label="Goal bar color:"
                  labelCol={10}
                />
              </div>
              <div className="form-element">
                <ColorPicker
                  setColor={(color) =>
                    setEditStatData({
                      ...editStatData,
                      content_color: color,
                    })
                  }
                  color={content_color}
                  label="Content color:"
                  labelCol={10}
                />
              </div>
              <div className="form-element">
                <SliderForm
                  label="Content alignment:"
                  marks={marksSlider as SliderMarks}
                  step={1}
                  min={0}
                  max={2}
                  setValue={(value) =>
                    setEditStatData({
                      ...editStatData,
                      aligment: marksSlider[value],
                    })
                  }
                  defaultValue={valueSlider ? +valueSlider : 1}
                  maxWidth={185}
                  tooltipVisible={false}
                  labelCol={10}
                />
              </div>

              <div className="btn-block">
                <BaseButton
                  formatId="profile_form_save_changes_button"
                  padding="6px 35px"
                  onClick={sendColorsData}
                  fontSize="18px"
                  disabled={loading}
                  isBlue
                />
              </div>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
};

export default StatsItem;
