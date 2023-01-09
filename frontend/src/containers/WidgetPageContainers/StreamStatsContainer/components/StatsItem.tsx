import { useState, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { Col, Row } from "antd";
import clsx from "clsx";
import { IStatData } from "types";

import LinkCopy from "components/LinkCopy";
import { CopyIcon, PencilIcon, TrashBinIcon } from "icons";
import ConfirmPopup from "components/ConfirmPopup";
import WidgetMobileWrapper from "components/WidgetMobileWrapper";
import SettingsStatBlock from "./SettingsStatBlock";
import PreviewStatBlock from "./PreviewStatBlock";

import useWindowDimensions from "hooks/useWindowDimensions";
import { useAppSelector } from "hooks/reduxHooks";
import { getStats } from "store/types/Stats";
import axiosClient, { baseURL } from "modules/axiosClient";
import {
  addNotification,
  addSuccessNotification,
  copyStr,
  getCurrentTimePeriodQuery,
  getStatsDataTypeQuery,
} from "utils";
import { IEditStatData } from "appTypes";

const StatsItem = ({
  statData,
  openEditModal,
}: {
  statData: IStatData;
  openEditModal?: (data: IStatData) => void;
}) => {
  const dispatch = useDispatch();
  const user = useAppSelector(({ user }) => user);
  const { isTablet } = useWindowDimensions();

  const [isActiveDetails, setisActiveDetails] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [editStatData, setEditStatData] = useState<IEditStatData>({
    title_color: "#ffffff",
    bar_color: "#1D14FF",
    content_color: "#212127",
    aligment: "Center",
  });

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
      await axiosClient.put("/api/widget/stats-widget/", {
        statData: {
          title_color,
          bar_color,
          content_color,
          aligment,
        },
        id,
      });
      dispatch(getStats(user.id));
      addSuccessNotification({ message: "Data saved successfully" });
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
      await axiosClient.delete("/api/widget/stats-widget/" + id);
      dispatch(getStats(user.id));
      addSuccessNotification({ message: "Widget deleted successfully" });
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

  const linkForCopy = useMemo(
    () => `${baseURL}/donat-stat/${user.username}/${id}`,
    [user, id]
  );

  const timePeriodName = useMemo(
    () => getCurrentTimePeriodQuery(time_period),
    [time_period]
  );

  const typeStatData = useMemo(
    () => getStatsDataTypeQuery(data_type),
    [data_type]
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
              <p>Date period: {timePeriodName} </p>
              <p>Date type: {typeStatData}</p>
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
          <WidgetMobileWrapper
            previewBlock={
              <PreviewStatBlock
                editStatData={editStatData}
                statData={statData}
                loading={loading}
                sendColorsData={sendColorsData}
              />
            }
            settingsBlock={
              <SettingsStatBlock
                editStatData={editStatData}
                loading={loading}
                setEditStatData={setEditStatData}
                sendColorsData={sendColorsData}
              />
            }
          />
        </div>
      )}
    </>
  );
};

export default StatsItem;
