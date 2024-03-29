import { useState, useEffect, useMemo, memo, FC, useContext } from "react";
import { Col, Progress, Row } from "antd";
import clsx from "clsx";
import { FormattedMessage, useIntl } from "react-intl";
import { goalDataKeys, IGoalData, ISocketEmitObj } from "types";

import LinkCopy from "components/LinkCopy";
import WidgetMobileWrapper from "components/WidgetMobileWrapper";
import { CopyIcon, PencilIcon, TrashBinIcon } from "icons";
import ConfirmPopup from "components/ConfirmPopup";
import PreviewGoalBlock from "./PreviewGoalBlock";
import SettingsGoalBlock from "./SettingsGoalBlock";
import FormBtnsBlock from "components/FormBtnsBlock";

import { useAppSelector } from "hooks/reduxHooks";
import useWindowDimensions from "hooks/useWindowDimensions";
import {
  useDeleteGoalMutation,
  useEditGoalMutation,
} from "store/services/GoalsService";
import { copyStr, loadFonts } from "utils";
import { ISelectItem } from "components/SelectInput";
import { WebSocketContext } from "contexts/Websocket";
import { RoutePaths, baseURL } from "consts";
import { IWidgetGoalData } from "appTypes";

interface IGoalItem {
  fonts: ISelectItem[];
  goalData: IGoalData;
  openEditModal?: (data: IWidgetGoalData) => void;
}

const GoalItem: FC<IGoalItem> = ({ fonts, goalData, openEditModal }) => {
  const intl = useIntl();
  const { username } = useAppSelector(({ user }) => user);
  const socket = useContext(WebSocketContext);
  const { isLaptop, isTablet } = useWindowDimensions();
  const [editGoal, { isLoading: isEditLoading }] = useEditGoalMutation();
  const [deleteGoal, { isLoading: isDeleteLoading }] = useDeleteGoalMutation();

  const [isActiveDetails, setisActiveDetails] = useState(false);
  const [editGoalData, setEditGoalData] = useState<IWidgetGoalData>({
    ...goalData,
    titleFont: {
      name: goalData.titleFont,
      link: "",
    },
    progressFont: {
      name: goalData.progressFont,
      link: "",
    },
  });

  const { id, title, amountGoal, amountRaised, isArchive, progressColor } =
    editGoalData;

  const handleActiveDetails = () =>
    !isArchive && setisActiveDetails(!isActiveDetails);

  const clickEditBtn = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    openEditModal && openEditModal(editGoalData);
  };

  const clickCopyBtn = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    copyStr({
      str: linkForCopy,
      copyObject: intl.formatMessage({ id: "copy_message_link" }),
    });
  };

  const initGoalItem = async () => {
    if (fonts) {
      const { titleFont, progressFont } = goalData;

      const loadedFonts = await loadFonts({
        fonts,
        fields: { titleFont, progressFont },
      });

      // convert IGoalData -> IWidgetGoalData
      const goalItemValues = Object.keys(goalData).reduce(
        (values, key) => ({
          ...values,
          [key]: goalData[key as goalDataKeys],
        }),
        editGoalData
      );
      setEditGoalData({ ...goalItemValues, ...loadedFonts });
    }
  };

  const editWidgetData = (isReset?: boolean) => async () => {
    try {
      const { id } = goalData;
      const { titleFont, progressFont } = editGoalData;

      await editGoal({
        ...editGoalData,
        titleFont: titleFont.name,
        progressFont: progressFont.name,
        isReset,
        id,
      });

      if (socket) {
        const emitObj: ISocketEmitObj = {
          id,
          toSendUsername: username,
          type: "change_goal",
        };
        socket.emit("widgetChange", emitObj);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const resetData = editWidgetData(true);

  const deleteGoalWidget = async () => {
    try {
      const { id } = goalData;
      await deleteGoal(id);
    } catch (error) {
      console.log(error);
    }
  };

  const linkForCopy = useMemo(
    () => `${baseURL}/${RoutePaths.donatGoal}/${username}/${id}`,
    [username, id]
  );

  const renderLinkForCopy = useMemo(
    () => linkForCopy.replace(id, "⁕⁕⁕⁕⁕"),
    [linkForCopy, id]
  );

  const isLoading = useMemo(
    () => isEditLoading || isDeleteLoading,
    [isEditLoading, isDeleteLoading]
  );

  useEffect(() => {
    fonts.length && initGoalItem();
  }, [fonts, goalData]);

  return (
    <>
      <div
        className={clsx("item", {
          active: isActiveDetails,
          archived: isArchive,
        })}
        onClick={handleActiveDetails}
      >
        <Row>
          <Col xs={3}>
            <Progress
              type="circle"
              percent={Math.round((amountRaised / amountGoal) * 100)}
              width={83}
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
          </Col>
          <Col
            xs={{ span: isTablet ? 16 : 18, offset: 5 }}
            sm={{ offset: 2 }}
            lg={{ offset: 0 }}
          >
            <Row
              style={{
                alignItems: "baseline",
                marginTop: 7,
              }}
            >
              <Col xl={9} xs={24}>
                <div className="mainInfo">
                  <p className="title">{title}</p>
                  <p className="description">
                    <FormattedMessage
                      id="goals_widget_card_raised"
                      values={{ amountRaised, amountGoal }}
                    />
                  </p>
                </div>
              </Col>
              {!isLaptop && (
                <Col span={13}>
                  {!isArchive && (
                    <div className="link">
                      <LinkCopy
                        link={linkForCopy}
                        title={renderLinkForCopy}
                        isSimple
                      />
                    </div>
                  )}
                </Col>
              )}
            </Row>
          </Col>
          <div className="btns">
            {isLaptop && !isArchive && (
              <div className="btn-item" onClick={clickCopyBtn}>
                <CopyIcon />
              </div>
            )}
            {!isArchive && (
              <div
                className="btn-item"
                onClick={clickEditBtn}
                style={{ marginRight: 10 }}
              >
                <PencilIcon />
              </div>
            )}
            <div
              className="btn-item"
              onClick={(e: React.MouseEvent<HTMLDivElement>) =>
                e.stopPropagation()
              }
            >
              <ConfirmPopup confirm={deleteGoalWidget}>
                <div>
                  <TrashBinIcon />
                </div>
              </ConfirmPopup>
            </div>
          </div>
        </Row>
      </div>
      {isActiveDetails && (
        <div className="details">
          <WidgetMobileWrapper
            previewBlock={
              <PreviewGoalBlock editGoalData={editGoalData}>
                <FormBtnsBlock
                  saveMethod={editWidgetData()}
                  resetMethod={resetData}
                  disabled={isLoading}
                />
              </PreviewGoalBlock>
            }
            settingsBlock={
              <SettingsGoalBlock
                fonts={fonts}
                editGoalData={editGoalData}
                setEditGoalData={setEditGoalData}
              >
                <FormBtnsBlock
                  saveMethod={editWidgetData()}
                  resetMethod={resetData}
                  disabled={isLoading}
                />
              </SettingsGoalBlock>
            }
          />
        </div>
      )}
    </>
  );
};

export default memo(GoalItem);
