import { useState, useMemo, useEffect } from "react";
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
import FormBtnsBlock from "components/FormBtnsBlock";

import useWindowDimensions from "hooks/useWindowDimensions";
import { useAppSelector } from "hooks/reduxHooks";
import { getStats } from "store/types/Stats";
import axiosClient from "modules/axiosClient";
import {
  addNotification,
  addSuccessNotification,
  copyStr,
  getCurrentTimePeriodQuery,
  getStatsDataTypeQuery,
  loadFonts,
} from "utils";
import { ISelectItem } from "components/SelectInput";
import { baseURL } from "consts";
import { IWidgetStatData } from "appTypes";

const StatsItem = ({
  fonts,
  statData,
  openEditModal,
}: {
  fonts: ISelectItem[];
  statData: IStatData;
  openEditModal?: (data: IWidgetStatData) => void;
}) => {
  const dispatch = useDispatch();
  const user = useAppSelector(({ user }) => user);
  const { isTablet } = useWindowDimensions();

  const [isActiveDetails, setisActiveDetails] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [editStatData, setEditStatData] = useState<IWidgetStatData>({
    ...statData,
    title_font: {
      name: statData.title_font,
      link: "",
    },
    content_font: {
      name: statData.content_font,
      link: "",
    },
  });

  const { id, title, stat_description, template, data_type, time_period } =
    editStatData;

  const handleActiveDetails = () => setisActiveDetails(!isActiveDetails);

  const clickEditBtn = (event?: React.MouseEvent<HTMLDivElement>) => {
    event && event.stopPropagation();
    openEditModal && openEditModal(editStatData);
  };

  const clickCopyBtn = (event?: React.MouseEvent<HTMLDivElement>) => {
    event && event.stopPropagation();
    copyStr(linkForCopy);
  };

  const initStatsItem = async () => {
    const { title_font, content_font } = statData;

    const loadedFonts = await loadFonts({
      fonts,
      fields: { title_font, content_font },
    });

    // convert statData:IStatData to statsItemValues:IWidgetStatData
    const statsItemValues = Object.keys(statData).reduce(
      (values, key) => ({ ...values, [key]: statData[key as keyof IStatData] }),
      editStatData
    );

    setEditStatData({ ...statsItemValues, ...loadedFonts });
  };

  const editWidgetData = (isReset?: boolean) => async () => {
    try {
      setLoading(true);
      const { id } = statData;
      const { title_font, content_font } = editStatData;

      const forSentStatData = Object.keys(editStatData).reduce((obj, key) => {
        const dataKey = key as keyof IWidgetStatData;
        if (dataKey === "custom_period") return obj;
        return { ...obj, [dataKey]: editStatData[dataKey] };
      }, {});

      await axiosClient.put("/api/widget/stats-widget/", {
        statData: {
          ...forSentStatData,
          title_font: title_font.name,
          content_font: content_font.name,
        },
        isReset,
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

  const resetData = editWidgetData(true);

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

  useEffect(() => {
    fonts.length && initStatsItem();
  }, [fonts, statData]);

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
              <PreviewStatBlock editStatData={editStatData}>
                <FormBtnsBlock
                  saveMethod={editWidgetData()}
                  resetMethod={resetData}
                  disabled={loading}
                />
              </PreviewStatBlock>
            }
            settingsBlock={
              <SettingsStatBlock
                fonts={fonts}
                editStatData={editStatData}
                setEditStatData={setEditStatData}
              >
                <FormBtnsBlock
                  saveMethod={editWidgetData()}
                  resetMethod={resetData}
                  disabled={loading}
                />
              </SettingsStatBlock>
            }
          />
        </div>
      )}
    </>
  );
};

export default StatsItem;
