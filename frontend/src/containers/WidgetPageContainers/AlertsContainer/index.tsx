import React, { useEffect, useMemo, useState } from "react";
import { fileUploadTypes, ISoundInfo } from "types";

import { useAppSelector } from "hooks/reduxHooks";
import useWindowDimensions from "hooks/useWindowDimensions";
import PageTitle from "components/PageTitle";
import BaseButton from "components/BaseButton";
import LinkCopy from "components/LinkCopy";
import SettingsAlertsBlock from "./components/SettingsAlertsBlock";
import PreviewAlertsBlock from "./components/PreviewAlertsBlock";
import WidgetMobileWrapper from "components/WidgetMobileWrapper";
import Loader from "components/Loader";

import axiosClient, { baseURL } from "modules/axiosClient";
import {
  addErrorNotification,
  addNotification,
  addSuccessNotification,
  getFontsList,
  getSounds,
  loadFont,
  sendFile,
} from "utils";
import { ISelectItem } from "components/SelectInput";
import { initAlertData } from "consts";
import { IAlert, IFont } from "appTypes";
import "./styles.sass";

const AlertsContainer = () => {
  const { id, username, donat_page } = useAppSelector(({ user }) => user);
  const { isLaptop } = useWindowDimensions();
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<IAlert>({ ...initAlertData });
  const [fonts, setFonts] = useState<ISelectItem[]>([]);
  const [soundsList, setSoundsList] = useState<ISoundInfo[]>([]);

  const getAlertsWidgetData = async () => {
    if (id && fonts) {
      setLoading(true);
      const { data } = await axiosClient.get(
        "/api/widget/get-alerts-widget/" + id
      );

      const soundsFolderName: fileUploadTypes = "sound";

      const getFontInfo = (type: string): IFont => ({
        name: data[`${type}_font`],
        link:
          fonts.find(({ value }) => value === data[`${type}_font`])?.key || "",
      });

      const name_font = getFontInfo("name");
      const message_font = getFontInfo("message");
      const sum_font = getFontInfo("sum");

      await Promise.all([
        loadFont(name_font),
        loadFont(message_font),
        loadFont(sum_font),
      ]);

      const userData: IAlert = {
        ...data,
        name_font,
        message_font,
        sum_font,
        banner: {
          ...formData.banner,
          preview: data.banner_link || "",
        },
        sound: data.sound.split(`${soundsFolderName}/`)[1] || "",
      };

      setFormData({
        ...formData,
        ...userData,
      });
      setLoading(false);
    }
  };

  const checkSuccessSending = (status?: number) => {
    status === 200
      ? addSuccessNotification({ message: "Data saved successfully" })
      : addErrorNotification({ message: "saving error" });
  };

  const sendData = async () => {
    try {
      setLoading(true);
      const {
        banner,
        message_color,
        message_font,
        name_color,
        name_font,
        sum_color,
        sum_font,
        duration,
        sound,
        voice,
        gender_voice,
      } = formData;

      const soundInfo = soundsList.find((s) => s.name === sound);

      const sendingData = JSON.stringify({
        message_color,
        message_font: message_font.name,
        name_color,
        name_font: name_font.name,
        sum_color,
        sum_font: sum_font.name,
        duration,
        sound: soundInfo?.link || "",
        voice,
        gender_voice,
      });

      if (banner.file || banner.preview) {
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
        checkSuccessSending(res?.status);
      } else {
        const { status } = await axiosClient.put(
          "/api/widget/edit-alerts-widget/",
          {
            alertData: sendingData,
            username,
            userId: id,
          }
        );
        checkSuccessSending(status);
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
      // await Promise.all(
      //   fonts.map(async (font) => {
      //     const loadedFont = await loadFont({
      //       name: font.value,
      //       link: font.key,
      //     });
      //     return loadedFont;
      //   })
      // );
      setFonts(fonts);
    };
    initFonts();
  }, []);

  const linkForStream = useMemo(
    () => `${baseURL}/donat-message/${username}/${donat_page.security_string}`,
    [username, donat_page]
  );

  return (
    <div className="alerts-container">
      {/* {fonts.length &&
        fonts.map((font) => (
          <StyledText font={font.value} fontLink={font.key} />
        ))} */}
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
        <div className="saveBottom">
          <BaseButton
            formatId="profile_form_save_changes_button"
            padding="6px 35px"
            onClick={sendData}
            fontSize="18px"
            disabled={loading}
            isMain
          />
        </div>
      </div>
      {/* <ChromePicker color={color} onChangeComplete={handleChange} disableAlpha /> */}
    </div>
  );
};

export default AlertsContainer;
