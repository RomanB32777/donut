import { useEffect, useState } from "react";
import clsx from "clsx";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import { INotification } from "types";

import { useAppSelector } from "hooks/reduxHooks";
import { tryToGetPersonInfo } from "store/types/PersonInfo";

import axiosClient from "modules/axiosClient";
import { getFontColorStyles, getFontsList, loadFonts } from "utils";
import { initAlertData, baseURL } from "consts";
import { IAlert } from "appTypes";

import bigImg from "assets/big_don.png";
import "./styles.sass";

const alertSound = new Audio();
const maxDuration = 5000;

const DonatAlertContainer = () => {
  const dispatch = useDispatch();
  const { notifications, personInfo } = useAppSelector((state) => state);
  const { name, security_string } = useParams();

  const [lastNotif, setLastNotif] = useState<INotification | null>(null);

  const [alertWidgetData, setAlertWidgetData] = useState<IAlert>({
    ...initAlertData,
  });

  const { list } = notifications;
  const { id } = personInfo;

  const {
    banner,
    message_color,
    message_font,
    name_color,
    name_font,
    sum_color,
    sum_font,
  } = alertWidgetData;

  const playSound = (soundLink: string) => {
    if (alertSound) {
      alertSound.pause();
      alertSound.src = soundLink;
      alertSound.play();
    }
  };

  const getAlertsWidgetData = async () => {
    const { data } = await axiosClient.get(
      `/api/widget/get-alerts-widget/${id}/${security_string}`
    );

    const fonts = await getFontsList();

    const { name_font, message_font, sum_font } = data;

    const loadedFonts = await loadFonts({
      fonts,
      fields: { name_font, message_font, sum_font },
    });

    const userData: IAlert = {
      ...data,
      ...loadedFonts,
      banner: {
        preview: data.banner,
        file: alertWidgetData.banner.file,
      },
      duration: Number(data.duration),
    };

    setAlertWidgetData({
      ...alertWidgetData,
      ...userData,
    });
  };

  useEffect(() => {
    list.length && setLastNotif(list[0]);
  }, [list]);

  // for testing
  // useEffect(() => {
  //   dispatch(getNotifications({ user: personInfo.id }));
  // }, [personInfo]);

  useEffect(() => {
    const { voice, sound, gender_voice } = alertWidgetData;
    const donation = lastNotif?.donation;
    if (donation) {
      const { donation_message } = donation;
      if (sound && maxDuration) {
        playSound(sound);
        setTimeout(() => {
          const { duration } = alertWidgetData;
          if (voice) {
            const tmp = new Audio(
              `${baseURL}/api/widget/sound/generate?text=${donation_message}&gender_voice=${gender_voice}`
            );
            tmp.play();
          }
          setTimeout(() => {
            // setLastNotif(null);
          }, duration * 1000);
        }, maxDuration);
      }
    }
  }, [lastNotif, alertWidgetData]);

  useEffect(() => {
    id && getAlertsWidgetData();
  }, [id]);

  useEffect(() => {
    name && dispatch(tryToGetPersonInfo(name));
  }, [name]);

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
            {sum_donation} {blockchain}
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
