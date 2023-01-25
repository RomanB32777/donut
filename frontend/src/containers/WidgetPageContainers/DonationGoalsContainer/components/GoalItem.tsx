import { useState, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { Col, Progress, Row } from "antd";
import clsx from "clsx";
import { goalDataKeys, IGoalData } from "types";

import LinkCopy from "components/LinkCopy";
import WidgetMobileWrapper from "components/WidgetMobileWrapper";
import { CopyIcon, PencilIcon, TrashBinIcon } from "icons";
import ConfirmPopup from "components/ConfirmPopup";
import PreviewGoalBlock from "./PreviewGoalBlock";
import SettingsGoalBlock from "./SettingsGoalBlock";
import FormBtnsBlock from "components/FormBtnsBlock";

import { useAppSelector } from "hooks/reduxHooks";
import useWindowDimensions from "hooks/useWindowDimensions";
import axiosClient from "modules/axiosClient";
import { getGoals } from "store/types/Goals";
import {
  addNotification,
  addSuccessNotification,
  copyStr,
  loadFonts,
} from "utils";
import { ISelectItem } from "components/SelectInput";
import { IWidgetGoalData } from "appTypes";
import { baseURL } from "consts";

const GoalItem = ({
  fonts,
  goalData,
  openEditModal,
}: {
  fonts: ISelectItem[];
  goalData: IGoalData;
  openEditModal?: (data: IWidgetGoalData) => void;
}) => {
  const dispatch = useDispatch();
  const user = useAppSelector(({ user }) => user);
  const { isLaptop, isTablet } = useWindowDimensions();

  const [isActiveDetails, setisActiveDetails] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [editGoalData, setEditGoalData] = useState<IWidgetGoalData>({
    ...goalData,
    title_font: {
      name: goalData.title_font,
      link: "",
    },
    progress_font: {
      name: goalData.progress_font,
      link: "",
    },
  });

  const { id, title, amount_goal, amount_raised, is_archive, progress_color } =
    editGoalData;

  const handleActiveDetails = () =>
    !is_archive && setisActiveDetails(!isActiveDetails);

  const clickEditBtn = (event?: React.MouseEvent<HTMLDivElement>) => {
    event && event.stopPropagation();
    openEditModal && openEditModal(editGoalData);
  };

  const clickCopyBtn = (event?: React.MouseEvent<HTMLDivElement>) => {
    event && event.stopPropagation();
    copyStr(linkForCopy);
  };

  const initGoalItem = async () => {
    if (fonts) {
      const { title_font, progress_font } = goalData;

      const loadedFonts = await loadFonts({
        fonts,
        fields: { title_font, progress_font },
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

  // useCallback(}, [dispatch, editGoalData, goalData, user]  ???
  const editWidgetData = (isReset?: boolean) => async () => {
    try {
      setLoading(true);
      const { id } = goalData;
      const { title_font, progress_font } = editGoalData;
      await axiosClient.put("/api/widget/goals-widget/", {
        goalData: {
          ...editGoalData,
          title_font: title_font.name,
          progress_font: progress_font.name,
        },
        creator_id: user.id,
        isReset,
        id,
      });
      dispatch(getGoals(user.id));
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

  const deleteGoalWidget = async () => {
    try {
      setLoading(true);
      const { id } = goalData;
      await axiosClient.delete("/api/widget/goals-widget/" + id);
      dispatch(getGoals(user.id));
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
    () => `${baseURL}/donat-goal/${user.username}/${id}`,
    [user, id]
  );

  const renderLinkForCopy = useMemo(
    () => linkForCopy.replace(id, "⁕⁕⁕⁕⁕"),
    [linkForCopy, id]
  );

  useEffect(() => {
    fonts && fonts.length && initGoalItem();
  }, [fonts, goalData]);

  return (
    <>
      <div
        className={clsx("item", {
          active: isActiveDetails,
          archived: is_archive,
        })}
        onClick={handleActiveDetails}
      >
        <Row>
          <Col xs={3}>
            <Progress
              type="circle"
              percent={Math.round((amount_raised / amount_goal) * 100)}
              width={83}
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
                    Raised: {amount_raised}/{amount_goal} USD
                  </p>
                </div>
              </Col>
              {!isLaptop && (
                <Col span={13}>
                  {!is_archive && (
                    <div className="link">
                      <LinkCopy link={linkForCopy} title={renderLinkForCopy} isSimple />
                    </div>
                  )}
                </Col>
              )}
            </Row>
          </Col>
          <div className="btns">
            {isLaptop && !is_archive && (
              <div className="btn-item" onClick={clickCopyBtn}>
                <CopyIcon />
              </div>
            )}
            {!is_archive && (
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
                  disabled={loading}
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
                  disabled={loading}
                />
              </SettingsGoalBlock>
            }
          />
        </div>
      )}
    </>
  );
};

export default GoalItem;
