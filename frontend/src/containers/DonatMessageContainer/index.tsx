import { useEffect, useState } from "react";
import useSound from "use-sound";
import clsx from "clsx";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { tryToGetPersonInfo } from "../../store/types/PersonInfo";

import bigImg from "../../assets/big_don.png";
import axiosClient from "../../axiosClient";
import { IAlertData, initAlertData } from "../../types";
import { url } from "../../consts";
import { soundsList } from "../../assets/sounds";
import EvmosIMG from "../../assets/evmos.png";
import "./styles.sass";

const testDonat = {
  wallet_type: "metamask",
  sum_donation: 50,
  username: "tester",
  donation_message:
    "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Architecto, optio deleniti. Placeat facilis cupiditate dolorem aspernatur quaerat magnam soluta, ratione ullam commodi provident officiis nobis quasi corporis atque? Numquam, necessitatibus!",
};

const DonatMessageContainer = () => {
  const dispatch = useDispatch();
  const { name } = useParams();
  const user = useSelector((state: any) => state.user);
  const notifications = useSelector((state: any) => state.notifications);

  const [lastNotif, setLastNotif] = useState<any>({
    // ...testDonat
  });

  const [alertWidgetData, setAlertWidgetData] = useState<IAlertData>({...initAlertData});

  useEffect(() => {
    const { duration } = alertWidgetData;
    notifications.length && setLastNotif(notifications[0].donation);
    setTimeout(() => {
      setLastNotif({});
    }, duration * 1000);
  }, [notifications]);

  useEffect(() => {
    const { voice, sound } = alertWidgetData;

    if (lastNotif.donation_message) {
      sound && play();
      if (voice && duration) {
        const timeout = setTimeout(() => {
          const speech = new SpeechSynthesisUtterance();
          speech.rate = 1.5;
          speech.pitch = 2;
          speech.volume = 1;
          speech.text = lastNotif.donation_message;
          window.speechSynthesis.speak(speech);
        }, duration);
        // return clearTimeout(timeout);
      }
    }
  }, [lastNotif]);

  useEffect(() => {
    // dispatch(setActiveUserName(pathnameEnd.slice(0, pathnameEnd.indexOf("/"))));
    dispatch(
      tryToGetPersonInfo({
        username: name,
      })
    );
  }, []);

  const getAlertsWidgetData = async (user: any) => {
    if (user.id) {
      const { data } = await axiosClient.get(
        "/api/user/get-alerts-widget/" + user.id
      );
      const userData: IAlertData = {
        banner: {
          preview: `${url + data.banner_link}`,
          file: alertWidgetData.banner.file,
        },
        message_color: data.message_color,
        name_color: data.name_color,
        sum_color: data.sum_color,
        duration: data.duration,
        sound: data.sound,
        voice: data.voice,
      };

      setAlertWidgetData({
        ...alertWidgetData,
        ...userData,
      });
    }
  };

  useEffect(() => {
    getAlertsWidgetData(user);
  }, [user]);

  const { banner, message_color, name_color, sum_color, sound } =
    alertWidgetData;

  const [play, { duration }] = useSound(soundsList[sound]);

  return (
    <div className="donat-messsage-container">
      {Boolean(Object.keys(lastNotif).length) && (
        <>
          <img
            src={banner.preview || bigImg}
            alt="banner"
            className={clsx("donat-messsage-container_banner", {
              rotate: !Boolean(banner.preview),
            })}
          />
          <div className="donat-messsage-container_title">
            <span>
              {lastNotif.username && lastNotif.sum_donation && (
                <>
                  <span
                    style={{
                      color: name_color,
                    }}
                  >
                    {lastNotif.username}{" "}
                  </span>{" "}
                  -{" "}
                  <span
                    style={{
                      color: sum_color,
                    }}
                  >
                    {lastNotif.sum_donation}{" "}
                    {lastNotif.wallet_type === "tron" && "TRX"}
                    {lastNotif.wallet_type === "metamask" && "tEVMOS"}
                  </span>
                </>
              )}
            </span>
            {lastNotif.wallet_type === "metamask" && (
              <img src={EvmosIMG} alt="evmos" />
            )}
          </div>
          <p
            className="donat-messsage-container_message"
            style={{
              color: message_color,
            }}
          >
            {lastNotif.donation_message}
          </p>
        </>
      )}
    </div>
  );
};

export default DonatMessageContainer;
