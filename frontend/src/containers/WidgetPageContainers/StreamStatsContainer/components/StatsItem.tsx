import { useState, useMemo, useEffect, memo, FC } from "react";
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
import {
  useDeleteStatMutation,
  useEditStatMutation,
} from "store/services/StatsService";
import {
  copyStr,
  getCurrentTimePeriodQuery,
  getStatsDataTypeQuery,
  loadFonts,
} from "utils";
import { ISelectItem } from "components/SelectInput";
import { RoutePaths } from "routes";
import { baseURL } from "consts";
import { IWidgetStatData } from "appTypes";

interface IStatsItem {
  fonts: ISelectItem[];
  statData: IStatData;
  openEditModal?: (data: IWidgetStatData) => void;
}

const StatsItem: FC<IStatsItem> = ({ fonts, statData, openEditModal }) => {
  const { username } = useAppSelector(({ user }) => user);
  const { isTablet } = useWindowDimensions();
  const [editStat, { isLoading: isEditLoading }] = useEditStatMutation();
  const [deleteStat, { isLoading: isDeleteLoading }] = useDeleteStatMutation();

  const [isActiveDetails, setisActiveDetails] = useState(false);
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

  const clickEditBtn = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    openEditModal && openEditModal(editStatData);
  };

  const clickCopyBtn = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
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
      const { id } = statData;
      const { title_font, content_font } = editStatData;

      const forSentStatData = Object.keys(editStatData).reduce((obj, key) => {
        const dataKey = key as keyof IWidgetStatData;
        if (dataKey === "custom_period") return obj;
        return { ...obj, [dataKey]: editStatData[dataKey] };
      }, {} as IWidgetStatData);

      await editStat({
        statData: {
          ...forSentStatData,
          title_font: title_font.name,
          content_font: content_font.name,
        },
        isReset,
        id,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const resetData = editWidgetData(true);

  const deleteStatWidget = async () => {
    try {
      const { id } = statData;
      await deleteStat(id);
    } catch (error) {
      console.log(error);
    }
  };

  const linkForCopy = useMemo(
    () => `${baseURL}/${RoutePaths.donatStat}/${username}/${id}`,
    [username, id]
  );

  const renderLinkForCopy = useMemo(
    () => linkForCopy.replace(id, "⁕⁕⁕⁕⁕"),
    [linkForCopy, id]
  );

  const timePeriodName = useMemo(
    () => getCurrentTimePeriodQuery(time_period),
    [time_period]
  );

  const typeStatData = useMemo(
    () => getStatsDataTypeQuery(data_type),
    [data_type]
  );

  const isLoading = useMemo(
    () => isEditLoading || isDeleteLoading,
    [isEditLoading, isDeleteLoading]
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
            <div className="mainInfo">
              <p className="title">{title}</p>
              <p className="description">{stat_description}</p>
            </div>
          </Col>
          <Col sm={11} xs={24}>
            <div className="parameters">
              <p>Date period: {timePeriodName} </p>
              <p>Date type: {typeStatData}</p>
              <p>Template: {template}</p>
              {!isTablet && (
                <LinkCopy
                  link={linkForCopy}
                  title={renderLinkForCopy}
                  isSimple
                />
              )}
            </div>
          </Col>
        </Row>
        <div className="btns">
          {isTablet && (
            <div className="item" onClick={clickCopyBtn}>
              <CopyIcon />
            </div>
          )}
          <div className="item" onClick={clickEditBtn}>
            <PencilIcon />
          </div>
          <div
            className="item"
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
        <div className="details">
          <WidgetMobileWrapper
            previewBlock={
              <PreviewStatBlock editStatData={editStatData}>
                <FormBtnsBlock
                  saveMethod={editWidgetData()}
                  resetMethod={resetData}
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
              </SettingsStatBlock>
            }
          />
        </div>
      )}
    </>
  );
};

export default memo(StatsItem);
