import { useEffect, useState } from "react";
import clsx from "clsx";
import { useParams } from "react-router";
import { IGenerateSoundQuery, INotification } from "types";

import { useAppSelector } from "hooks/reduxHooks";
import { useGetAlertWidgetDataQuery } from "store/services/AlertsService";
import {
  formatNumber,
  getFontColorStyles,
  getFontsList,
  loadFonts,
} from "utils";
import { initAlertData, baseURL, maxSoundDuration } from "consts";
import { IAlert } from "appTypes";

import bigImg from "assets/big_don.png";
import "./styles.sass";

const alertSound = new Audio();

const DonateAlertContainer = () => {
  const { list } = useAppSelector(({ notifications }) => notifications);
  const { name, id } = useParams();

  const { data: alertData, error } = useGetAlertWidgetDataQuery(id as string, {
    skip: !id || !name,
  });

  const [lastNotif, setLastNotif] = useState<INotification | null>(null);

  const [alertWidgetData, setAlertWidgetData] = useState<IAlert>(initAlertData);

  const playSound = (soundLink: string) => {
    if (alertSound) {
      alertSound.pause();
      alertSound.src = soundLink;
      alertSound.play();
    }
  };

  useEffect(() => {
    list.length && setLastNotif(list[0]);
  }, [list]);

  useEffect(() => {
    const { voice, sound, genderVoice } = alertWidgetData;
    const donation = lastNotif?.donation;
    if (donation) {
      const { message } = donation;
      if (sound) {
        playSound(sound.path);
        setTimeout(() => {
          const { duration } = alertWidgetData;
          if (voice) {
            const text = message.replaceAll("*", "");
            const queryParams: IGenerateSoundQuery = {
              text,
              genderVoice,
            };

            const queryString = Object.entries(queryParams)
              .map(([param, value]) => `${param}=${value}`)
              .join("&");

            const tmp = new Audio(
              `${baseURL}/api/widgets/alerts/generate/sound?${queryString}`
            );
            tmp.play();
          }
          setTimeout(() => {
            setLastNotif(null);
          }, duration * 1000);
        }, maxSoundDuration * 1000);
      }
    }
  }, [lastNotif, alertWidgetData]);

  useEffect(() => {
    const initAlertData = async () => {
      if (!alertData) return;

      const fonts = await getFontsList();
      const {
        nameFont,
        messageFont,
        sumFont,
        banner,
        sound,
        duration,
        ...widgetData
      } = alertData;

      const loadedFonts = await loadFonts({
        fonts,
        fields: { nameFont, messageFont, sumFont },
      });

      setAlertWidgetData((alertWidgetData) => ({
        ...alertWidgetData,
        ...widgetData,
        ...loadedFonts,
        banner: {
          ...alertWidgetData.banner,
          preview: banner,
        },
        sound: {
          ...alertWidgetData.sound,
          path: sound,
        },
        duration: Number(duration),
      }));
    };

    initAlertData();
  }, [alertData]);

  if (error) {
    console.log(error);
    return null;
  }

  const {
    banner,
    messageColor,
    messageFont,
    nameColor,
    nameFont,
    sumColor,
    sumFont,
  } = alertWidgetData;

  if (lastNotif && lastNotif.donation) {
    const { sum, blockchain, message } = lastNotif.donation;
    const sender = lastNotif.users.find(
      ({ roleplay }) => roleplay === "sender"
    );
    return (
      <div className="donat-messsage-container">
        <img
          src={banner.preview || bigImg}
          alt="banner"
          className={clsx("donat-messsage-container_banner", {
            rotate: !Boolean(banner.preview),
          })}
        />
        <div className="donat-messsage-container_title">
          <span style={getFontColorStyles(nameColor, nameFont)}>
            {sender?.user.username}
          </span>
          &nbsp;-&nbsp;
          <span style={getFontColorStyles(sumColor, sumFont)}>
            {formatNumber(sum, 3)} {blockchain}
          </span>
        </div>
        <p
          className="donat-messsage-container_message"
          style={getFontColorStyles(messageColor, messageFont)}
        >
          {message}
        </p>
      </div>
    );
  }

  return <></>;
};

export default DonateAlertContainer;
