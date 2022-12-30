import { useEffect, useState } from "react";
import useSound from "use-sound";
import clsx from "clsx";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { tryToGetPersonInfo } from "../../../store/types/PersonInfo";

import bigImg from "../../../assets/big_don.png";
import axiosClient, { baseURL } from "../../../axiosClient";
import { IAlert } from "../../../types";
import { initAlertData } from "../../../consts";
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
  const { list } = useSelector(
    (state: any) => state.notifications
  );
  const { name } = useParams();

  const [lastNotif, setLastNotif] = useState<any>({
    // ...testDonat,
  });

  const [alertWidgetData, setAlertWidgetData] = useState<IAlert>({
    ...initAlertData,
  });

  useEffect(() => {
    list.length && setLastNotif(list[0].donation);
  }, [list]);

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
      const userData: IAlert = {
        ...data,
        banner: {
          preview: data.banner_link,
          file: alertWidgetData.banner.file,
        },
        duration: Number(data.duration),
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
                    {lastNotif.username}&nbsp;
                  </span>&nbsp;
                  -&nbsp;
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
