import { useEffect, useState } from "react";
import useSound from "use-sound";
import clsx from "clsx";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { tryToGetPersonInfo } from "../../../store/types/PersonInfo";

import bigImg from "../../../assets/big_don.png";
import axiosClient, { baseURL } from "../../../axiosClient";
import { IAlertData, initAlertData } from "../../../types";
import { url } from "../../../consts";
import { soundsList } from "../../../assets/sounds";
import "./styles.sass";

// const testDonat = {
//   wallet_type: "metamask",
//   sum_donation: 50,
//   username: "tester",
//   donation_message:
//     "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Architecto, optio deleniti. Placeat facilis cupiditate dolorem aspernatur quaerat magnam soluta, ratione ullam commodi provident officiis nobis quasi corporis atque? Numquam, necessitatibus!",
// };

const DonatMessageContainer = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.personInfo).main_info;
  const notifications = useSelector((state: any) => state.notifications);
  const { name } = useParams();

  const [lastNotif, setLastNotif] = useState<any>({
    // ...testDonat,
  });

  const [alertWidgetData, setAlertWidgetData] = useState<IAlertData>({
    ...initAlertData,
  });

  useEffect(() => {
    notifications.length && setLastNotif(notifications[0].donation);
  }, [notifications]);

  useEffect(() => {
    const { voice, sound, gender_voice } = alertWidgetData;
    if (lastNotif.sum_donation) {
      if (sound && duration) {
        play();
        setTimeout(() => {
          const { duration } = alertWidgetData;
          if (voice && lastNotif.donation_message) {
            const tmp = new Audio(
              `${baseURL}/api/widget/generate/sound?text=${lastNotif.donation_message}&gender_voice=${gender_voice}`
            );
            tmp.play();
          }
          setTimeout(() => {
            setLastNotif({});
          }, duration * 1000);
        }, duration);
      }
    }
  }, [lastNotif]);

  const getAlertsWidgetData = async (user: any) => {
    if (user.id) {
      const { data } = await axiosClient.get(
        "/api/widget/get-alerts-widget/" + user.id
      );
      const userData: IAlertData = {
        banner: {
          preview: data.banner_link,
          file: alertWidgetData.banner.file,
        },
        message_color: data.message_color,
        name_color: data.name_color,
        sum_color: data.sum_color,
        duration: Number(data.duration),
        sound: data.sound,
        voice: data.voice,
        gender_voice: data.gender_voice,
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

  useEffect(() => {
    dispatch(
      tryToGetPersonInfo({
        username: name,
      })
    );
  }, [name]);

  // const blockchainImg = useMemo(() => {
  //   const currBlockchain = walletsConf[
  //     process.env.REACT_APP_WALLET || "metamask"
  //   ].blockchains.find((b) => b.nativeCurrency.symbol === lastNotif.blockchain);
  //   if (currBlockchain) return currBlockchain.icon;
  //   return "";
  // }, [lastNotif]);

  const { banner, message_color, name_color, sum_color, sound } =
    alertWidgetData;

  const [play, { duration }] = useSound(soundsList[sound]);

  return (
    <div className="donat-messsage-container">
      {Boolean(Object.keys(lastNotif).length) && (
        <>
          <img
            src={banner.preview ? url + banner.preview : bigImg}
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
                    {lastNotif.sum_donation} {lastNotif.blockchain}
                  </span>
                </>
              )}
            </span>
            {/* <img src={blockchainImg} alt="" /> */}
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
