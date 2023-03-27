import React, { useEffect, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
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
  useGetAlertWidgetDataByCreatorQuery,
} from "store/services/AlertsService";
import { getFontsList, loadFonts } from "utils";
import { RoutePaths, initAlertData, baseURL } from "consts";
import { ISelectItem } from "components/SelectInput";
import { IAlert } from "appTypes";
import "./styles.sass";

const soundsFolderName: fileUploadTypes = "sound";

const AlertsContainer = () => {
  const { id, username } = useAppSelector(({ user }) => user);
  const { isLaptop } = useWindowDimensions();

  const [formData, setFormData] = useState<IAlert>(initAlertData);
  const [fonts, setFonts] = useState<ISelectItem[]>([]);

  const {
    data: alertData,
    isLoading: isGetLoading,
    isError: isGetError,
  } = useGetAlertWidgetDataByCreatorQuery(id, {
    skip: !username,
  });

  const [editAlert, { isLoading: isEditLoading }] =
    useEditAlertsWidgetMutation();

  const { id: widgetID } = formData;

  const sendData = (isReset?: boolean) => async () => {
    const { banner, messageFont, nameFont, sumFont, sound, ...alertData } =
      formData;

    const [editArgs]: Parameters<typeof editAlert> = [
      {
        ...alertData,
        messageFont: messageFont.name,
        nameFont: nameFont.name,
        sumFont: sumFont.name,
        sound: sound.path,
      },
    ];

    if (typeof isReset !== "undefined") editArgs.isReset = isReset;

    if (banner) {
      const { file, preview } = banner;
      if (file) editArgs.alert = file;
      else if (preview) editArgs.banner = preview;
    }

    await editAlert(editArgs);
  };

  const linkForStream = `${baseURL}/${RoutePaths.donatMessage}/${username}/${widgetID}`;

  const renderLinkForStream = useMemo(
    () => linkForStream.replace(widgetID, "⁕⁕⁕⁕⁕"),
    [linkForStream, widgetID]
  );

  useEffect(() => {
    const setAlertData = async () => {
      if (alertData) {
        const { nameFont, messageFont, sumFont, banner, sound } = alertData;

        const loadedFonts = await loadFonts({
          fonts,
          fields: { nameFont, messageFont, sumFont },
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
            path: sound,
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
          <FormattedMessage id="alerts_subtitle" />
        </p>
        <LinkCopy
          link={linkForStream}
          isSimple={!isLaptop}
          title={renderLinkForStream}
        />
      </div>
      <div className="alertsSettings">
        <PageTitle formatId="page_title_design" />
        {isGetLoading || !formData.id ? (
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
          resetMethod={sendData(true)}
          disabled={isEditLoading}
        />
      </div>
      {/* <ChromePicker color={color} onChangeComplete={handleChange} disableAlpha /> */}
    </div>
  );
};

export default AlertsContainer;
