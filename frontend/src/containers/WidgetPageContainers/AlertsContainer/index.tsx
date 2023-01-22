import React, { useEffect, useMemo, useState } from "react";
import { fileUploadTypes, ISoundInfo } from "types";

import { useAppSelector } from "hooks/reduxHooks";
import useWindowDimensions from "hooks/useWindowDimensions";
import PageTitle from "components/PageTitle";
import LinkCopy from "components/LinkCopy";
import SettingsAlertsBlock from "./components/SettingsAlertsBlock";
import PreviewAlertsBlock from "./components/PreviewAlertsBlock";
import WidgetMobileWrapper from "components/WidgetMobileWrapper";
import FormBtnsBlock from "components/FormBtnsBlock";
import Loader from "components/Loader";

import axiosClient from "modules/axiosClient";
import {
  addErrorNotification,
  addNotification,
  addSuccessNotification,
  getFontsList,
  getSounds,
  loadFonts,
  sendFile,
} from "utils";
import { ISelectItem } from "components/SelectInput";
import { initAlertData, baseURL } from "consts";
import { IAlert } from "appTypes";
import "./styles.sass";

const AlertsContainer = () => {
  const { id, username, donat_page } = useAppSelector(({ user }) => user);
  const { isLaptop } = useWindowDimensions();
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<IAlert>({ ...initAlertData });
  const [fonts, setFonts] = useState<ISelectItem[]>([]);
  const [soundsList, setSoundsList] = useState<ISoundInfo[]>([]);

  // data: IAlertData
  const setAlertData = async (data: any) => {
    const soundsFolderName: fileUploadTypes = "sound";
    const { name_font, message_font, sum_font, sound } = data;

    const loadedFonts = await loadFonts({
      fonts,
      fields: { name_font, message_font, sum_font },
    });

    const userData: IAlert = {
      ...data,
      ...loadedFonts,
      banner: {
        ...formData.banner,
        preview: data.banner || "",
      },
      sound: sound.split(`${soundsFolderName}/`)[1],
    };

    setFormData({
      ...formData,
      ...userData,
    });
  };

  const getAlertsWidgetData = async () => {
    if (id && fonts) {
      setLoading(true);
      const { data, status } = await axiosClient.get(
        "/api/widget/get-alerts-widget/" + id
      );
      if (status === 200) await setAlertData(data);
      setLoading(false);
    }
  };

  const checkSuccessSending = ({
    data,
    status,
  }: {
    data: any;
    status: number;
  }) => {
    if (status === 200) {
      addSuccessNotification({ message: "Data saved successfully" });
      setAlertData(data);
    } else addErrorNotification({ message: "saving error" });
  };

  const sendData = (isReset?: boolean) => async () => {
    try {
      setLoading(true);
      const {
        banner,
        message_font,
        name_font,
        sum_font,
        sound,
        ...fieldValues
      } = formData;

      const soundInfo = soundsList.find((s) => s.name === sound);

      const sendingData = JSON.stringify({
        message_font: message_font.name,
        name_font: name_font.name,
        sum_font: sum_font.name,
        sound: soundInfo?.link || "",
        ...fieldValues,
      });

      if (!(banner.file || banner.preview) || isReset) {
        const { data, status } = await axiosClient.put(
          "/api/widget/edit-alerts-widget/",
          {
            alertData: sendingData,
            username,
            userId: id,
            isReset,
          }
        );
        checkSuccessSending({ data, status });
      } else if (banner.file || banner.preview) {
        const res = await sendFile({
          file: banner.file,
          filelink: banner.preview,
          username,
          userId: id,
          data: {
            key: "alertData",
            body: sendingData,
          },
          url: "/api/widget/edit-alerts-widget/",
        });
        res && checkSuccessSending({ data: res.data, status: res.status });
      }
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

  const resetData = sendData(true);

  useEffect(() => {
    const initSounds = async () => {
      const sounds = await getSounds(username);
      sounds.length && setSoundsList(sounds);
    };

    if (id) {
      initSounds();
      fonts.length && getAlertsWidgetData();
    }
  }, [id, fonts]);

  useEffect(() => {
    const initFonts = async () => {
      const fonts = await getFontsList();
      setFonts(fonts);
    };
    initFonts();
  }, []);

  const linkForStream = useMemo(
    () => `${baseURL}/donat-message/${username}/${donat_page.security_string}`,
    [username, donat_page]
  );

  return (
    <div className="alerts-container fadeIn">
      <PageTitle formatId="page_title_alerts" />
      <div className="link-top">
        <p>
          Paste this link into broadcasting software you use and display your
          incoming donations
        </p>
        <LinkCopy link={linkForStream} isSimple={!isLaptop} />
      </div>
      <div className="alertsSettings">
        <PageTitle formatId="page_title_design" />
        {loading ? (
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
                soundsList={soundsList}
                setFormData={setFormData}
                setSoundsList={setSoundsList}
              />
            }
          />
        )}
        <FormBtnsBlock
          saveMethod={sendData()}
          resetMethod={resetData}
          disabled={loading}
        />
      </div>
      {/* <ChromePicker color={color} onChangeComplete={handleChange} disableAlpha /> */}
    </div>
  );
};

export default AlertsContainer;
