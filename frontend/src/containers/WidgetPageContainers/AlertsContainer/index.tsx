import React, { useEffect, useMemo, useState } from "react";
import { fileUploadTypes } from "types";

import { useAppSelector } from "hooks/reduxHooks";
import useWindowDimensions from "hooks/useWindowDimensions";
import PageTitle from "components/PageTitle";
import LinkCopy from "components/LinkCopy";
import SettingsAlertsBlock from "./components/SettingsAlertsBlock";
import PreviewAlertsBlock from "./components/PreviewAlertsBlock";
import WidgetMobileWrapper from "components/WidgetMobileWrapper";
import FormBtnsBlock from "components/FormBtnsBlock";
import Loader from "components/Loader";
import NoPageContainer from "containers/NoPageContainer";

import {
  useEditAlertsWidgetMutation,
  useGetAlertWidgetDataQuery,
} from "store/services/AlertsService";
import { getFontsList, loadFonts } from "utils";
import { RoutePaths } from "routes";
import { initAlertData, baseURL } from "consts";
import { ISelectItem } from "components/SelectInput";
import { IAlert } from "appTypes";
import "./styles.sass";

const soundsFolderName: fileUploadTypes = "sound";

const AlertsContainer = () => {
  const { id, username } = useAppSelector(({ user }) => user);
  const { isLaptop } = useWindowDimensions();

  const [formData, setFormData] = useState<IAlert>({ ...initAlertData });
  const [fonts, setFonts] = useState<ISelectItem[]>([]);

  const {
    data: alertData,
    isLoading: isGetLoading,
    isError: isGetError,
  } = useGetAlertWidgetDataQuery(
    {
      username: username,
      id: "",
    },
    {
      skip: !username,
    }
  );

  const [editAlert, { isLoading: isEditLoading }] =
    useEditAlertsWidgetMutation();

  const { id: widgetID } = formData;

  const sendData = (isReset?: boolean) => async () => {
    const { banner, message_font, name_font, sum_font, sound } = formData;

    await editAlert({
      data: {
        ...formData,
        message_font: message_font.name,
        name_font: name_font.name,
        sum_font: sum_font.name,
        sound: sound.link,
        banner: banner.preview,
      },
      file: banner.file,
      filelink: banner.preview,
      username,
      userID: id,
      isReset,
    });
    // .unwrap()
  };

  const resetData = sendData(true);

  const linkForStream = useMemo(
    () => `${baseURL}/${RoutePaths.donatMessage}/${username}/${widgetID}`,
    [username, widgetID]
  );

  const renderLinkForStream = useMemo(
    () => linkForStream.replace(widgetID, "⁕⁕⁕⁕⁕"),
    [linkForStream, widgetID]
  );

  const isLoading = useMemo(
    () => isGetLoading || isEditLoading,
    [isGetLoading, isEditLoading]
  );

  useEffect(() => {
    const setAlertData = async () => {
      if (alertData) {
        const { name_font, message_font, sum_font, banner, sound } = alertData;

        const loadedFonts = await loadFonts({
          fonts,
          fields: { name_font, message_font, sum_font },
        });

        setFormData((prev) => ({
          ...prev,
          ...alertData,
          ...loadedFonts,
          banner: {
            ...prev.banner,
            preview: banner || "",
          },
          sound: {
            name: sound.split(`${soundsFolderName}/`)[1],
            link: sound,
          },
        }));
      }
    };

    setAlertData();
  }, [alertData, fonts]);

  useEffect(() => {
    const initFonts = async () => {
      const fonts = await getFontsList();
      setFonts(fonts);
    };

    initFonts();
  }, []);

  if (isGetError) return <NoPageContainer />;

  return (
    <div className="alerts-container fadeIn">
      <PageTitle formatId="page_title_alerts" />
      <div className="link-top">
        <p>
          Paste this link into broadcasting software you use and display your
          incoming donations
        </p>
        <LinkCopy
          link={linkForStream}
          isSimple={!isLaptop}
          title={renderLinkForStream}
        />
      </div>
      <div className="alertsSettings">
        <PageTitle formatId="page_title_design" />
        {isLoading ? (
          <div className="init-loader">
            <Loader size="big" />
          </div>
        ) : (
          <WidgetMobileWrapper
            previewBlock={
              <PreviewAlertsBlock key="preview" formData={formData} />
            }
            settingsBlock={
              <SettingsAlertsBlock
                key="settings"
                fonts={fonts}
                formData={formData}
                setFormData={setFormData}
              />
            }
          />
        )}
        <FormBtnsBlock
          saveMethod={sendData()}
          resetMethod={resetData}
          disabled={isLoading}
        />
      </div>
      {/* <ChromePicker color={color} onChangeComplete={handleChange} disableAlpha /> */}
    </div>
  );
};

export default AlertsContainer;
