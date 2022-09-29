import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, Progress, Row } from "antd";
import clsx from "clsx";
import LinkCopy from "../../../../components/LinkCopy";
import { CopyIcon, PencilIcon, TrashBinIcon } from "../../../../icons/icons";
import ColorPicker from "../../../../components/ColorPicker";
import ConfirmPopup from "../../../../components/ConfirmPopup";
import BaseButton from "../../../../components/BaseButton";
import axiosClient, { baseURL } from "../../../../axiosClient";
import {
  alignFlextItemsList,
  alignItemsList,
  AlignText,
  IStatData,
  typeAligmnet,
  typesTabContent,
} from "../../../../types";
import {
  addNotification,
  addSuccessNotification,
  copyStr,
  renderStatItem,
} from "../../../../utils";
import { getStats } from "../../../../store/types/Stats";
import { SliderMarks } from "antd/lib/slider";
import SliderForm from "../../../../components/SliderForm";
import useWindowDimensions from "../../../../hooks/useWindowDimensions";
import { TabsComponent } from "../../../../components/TabsComponent";

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

const PreviewStatBlock = ({
  editStatData,
  statData,
  loading,
  sendColorsData,
}: {
  editStatData: IEditStatData;
  statData: IStatData;
  loading: boolean;
  sendColorsData: () => Promise<void>;
}) => {
  const { isLaptop } = useWindowDimensions();
  const { template, data_type, time_period } = statData;
  const { title_color, bar_color, content_color, aligment } = editStatData;
  return (
    <Col
      xl={10}
      md={24}
      style={{
        width: "100%",
      }}
    >
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
                textAlign: (alignItemsList[aligment] as AlignText) || "center",
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
                textAlign: (alignItemsList[aligment] as AlignText) || "center",
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
      {isLaptop && (
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
      )}
    </Col>
  );
};

const SettingsStatBlock = ({
  editStatData,
  loading,
  sendColorsData,
  setEditStatData,
}: {
  editStatData: IEditStatData;
  loading: boolean;
  sendColorsData: () => Promise<void>;
  setEditStatData: (editStatData: IEditStatData) => void;
}) => {
  const { title_color, bar_color, content_color, aligment } = editStatData;

  const valueSlider = useMemo(
    () =>
      Object.keys(marksSlider).find((key) => marksSlider[+key] === aligment),
    [aligment]
  );

  return (
    <Col xl={13} md={24}>
      <Row gutter={[0, 18]} className="form">
        <Col span={24}>
          <div className="form-element">
            <ColorPicker
              setColor={(color) =>
                setEditStatData({ ...editStatData, title_color: color })
              }
              color={title_color}
              label="Goal title color:"
              labelCol={10}
              gutter={[0, 18]}
            />
          </div>
        </Col>
        <Col span={24}>
          <div className="form-element">
            <ColorPicker
              setColor={(color) =>
                setEditStatData({ ...editStatData, bar_color: color })
              }
              color={bar_color}
              label="Goal bar color:"
              labelCol={10}
              gutter={[0, 18]}
            />
          </div>
        </Col>
        <Col span={24}>
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
              gutter={[0, 18]}
            />
          </div>
        </Col>
        <Col span={24}>
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
          isBlue
        />
      </div>
    </Col>
  );
};

const StatsItem = ({
  statData,
  openEditModal,
}: {
  statData: IStatData;
  openEditModal?: (data: IStatData) => void;
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const { isLaptop, isTablet } = useWindowDimensions();

  const [isActiveDetails, setisActiveDetails] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [editStatData, setEditStatData] = useState<IEditStatData>({
    title_color: "#ffffff",
    bar_color: "#1D14FF",
    content_color: "#212127",
    aligment: "Center",
  });
  const [tabContent, setTabContent] = useState<typesTabContent>("all");

  const handleActiveDetails = () => setisActiveDetails(!isActiveDetails);

  const clickEditBtn = (event?: React.MouseEvent<HTMLDivElement>) => {
    event && event.stopPropagation();
    openEditModal && openEditModal(statData);
  };

  const clickCopyBtn = (event?: React.MouseEvent<HTMLDivElement>) => {
    event && event.stopPropagation();
    copyStr(linkForCopy);
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

  const deleteStatWidget = async () => {
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

  useEffect(() => {
    isLaptop ? setTabContent("settings") : setTabContent("all");
  }, [isLaptop]);

  const contents: { type: typesTabContent; content: React.ReactNode }[] = [
    {
      type: "preview",
      content: (
        <PreviewStatBlock
          editStatData={editStatData}
          statData={statData}
          loading={loading}
          sendColorsData={sendColorsData}
        />
      ),
    },
    {
      type: "settings",
      content: (
        <SettingsStatBlock
          editStatData={editStatData}
          loading={loading}
          setEditStatData={setEditStatData}
          sendColorsData={sendColorsData}
        />
      ),
    },
    {
      type: "all",
      content: (
        <>
          <PreviewStatBlock
            editStatData={editStatData}
            statData={statData}
            loading={loading}
            sendColorsData={sendColorsData}
          />
          <SettingsStatBlock
            editStatData={editStatData}
            loading={loading}
            setEditStatData={setEditStatData}
            sendColorsData={sendColorsData}
          />
        </>
      ),
    },
  ];

  const { id, title, stat_description, template, data_type, time_period } =
    statData;

  const linkForCopy = useMemo(
    () => `${baseURL}/donat-stat/${user.username}/${id}`,
    [baseURL, user, id]
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
          <Col sm={11} xs={24}>
            <div className="stats-item__mainInfo">
              <p className="stats-item__mainInfo_title">{title}</p>
              <p className="stats-item__mainInfo_description">
                {stat_description}
              </p>
            </div>
          </Col>
          <Col sm={11} xs={24}>
            <div className="stats-item__parameters">
              <p>Date period: {time_period} </p>
              <p>Date type: {data_type}</p>
              <p>Template: {template}</p>
              {!isTablet && <LinkCopy link={linkForCopy} isSimple />}
            </div>
          </Col>
        </Row>
        <div className="stats-item__btns">
          {isTablet && (
            <div className="stats-item__btns_item" onClick={clickCopyBtn}>
              <CopyIcon />
            </div>
          )}
          <div className="stats-item__btns_item" onClick={clickEditBtn}>
            <PencilIcon />
          </div>
          <div
            className="stats-item__btns_item"
            onClick={(e?: React.MouseEvent<HTMLDivElement>) =>
              e && e.stopPropagation()
            }
          >
            <ConfirmPopup confirm={deleteStatWidget}>
              <div>
                <TrashBinIcon />
              </div>
            </ConfirmPopup>
          </div>
        </div>
      </div>
      {isActiveDetails && (
        <div className="stats-item__details">
          {tabContent !== "all" && (
            <TabsComponent setTabContent={setTabContent} />
          )}
          <Row
            gutter={[4, 4]}
            className="stats-item__details-container"
            justify="space-between"
          >
            {contents.map(
              (block) => block.type === tabContent && block.content
            )}
          </Row>
        </div>
      )}
    </>
  );
};

export default StatsItem;
