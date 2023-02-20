import { useEffect, useState } from "react";
import clsx from "clsx";
import { useParams } from "react-router";
import { INotification } from "types";

import { useAppSelector } from "hooks/reduxHooks";
import { useGetAlertWidgetDataQuery } from "store/services/AlertsService";
import {
  formatNumber,
  getFontColorStyles,
  getFontsList,
  loadFonts,
} from "utils";
import { initAlertData, baseURL } from "consts";
import { IAlert } from "appTypes";

import bigImg from "assets/big_don.png";
import "./styles.sass";

const alertSound = new Audio();
const maxDuration = 5000;

const DonatAlertContainer = () => {
  const { list } = useAppSelector(({ notifications }) => notifications);
  const { name, id } = useParams();

  const { data: alertData, error } = useGetAlertWidgetDataQuery(
    {
      username: name as string,
      id: id as string,
    },
    { skip: !id || !name }
  );

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
    const { voice, sound, gender_voice } = alertWidgetData;
    const donation = lastNotif?.donation;
    if (donation) {
      const { donation_message } = donation;
      if (sound && maxDuration) {
        playSound(sound.link);
        setTimeout(() => {
          const { duration } = alertWidgetData;
          if (voice) {
            const tmp = new Audio(
              `${baseURL}/api/widget/sound?text=${donation_message}&gender_voice=${gender_voice}`
            );
            tmp.play();
          }
          setTimeout(() => {
            setLastNotif(null);
          }, duration * 1000);
        }, maxDuration);
      }
    }
  }, [lastNotif, alertWidgetData]);

  useEffect(() => {
    const initAlertData = async () => {
      if (!alertData) return;

      const fonts = await getFontsList();

      const { name_font, message_font, sum_font, banner, sound, duration } =
        alertData;

      const loadedFonts = await loadFonts({
        fonts,
        fields: { name_font, message_font, sum_font },
      });

      setAlertWidgetData((alertWidgetData) => ({
        ...alertWidgetData,
        ...(alertData as any),
        ...loadedFonts,
        banner: {
          ...alertWidgetData.banner,
          preview: banner,
        },
        sound: {
          ...alertWidgetData.sound,
          link: sound,
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
    message_color,
    message_font,
    name_color,
    name_font,
    sum_color,
    sum_font,
  } = alertWidgetData;

  if (lastNotif && lastNotif.donation) {
    const { sum_donation, blockchain, donation_message } = lastNotif.donation;
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
          <span style={getFontColorStyles(name_color, name_font)}>
            {lastNotif.sender}
          </span>
          &nbsp;-&nbsp;
          <span style={getFontColorStyles(sum_color, sum_font)}>
            {formatNumber(sum_donation, 3)} {blockchain}
          </span>
        </div>
        <p
          className="donat-messsage-container_message"
          style={getFontColorStyles(message_color, message_font)}
        >
          {donation_message}
        </p>
      </div>
    );
  }

  return <></>;
};

export default DonatAlertContainer;
