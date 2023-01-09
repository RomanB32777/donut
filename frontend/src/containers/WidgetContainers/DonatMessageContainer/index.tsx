import { useEffect, useState } from "react";
import clsx from "clsx";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import { INotification } from "types";

import { useAppSelector } from "hooks/reduxHooks";
import { tryToGetPersonInfo } from "store/types/PersonInfo";

import axiosClient, { baseURL } from "modules/axiosClient";
import { IAlert } from "appTypes";
import { initAlertData } from "consts";
import bigImg from "assets/big_don.png";
import "./styles.sass";

const alertSound = new Audio();
const maxDuration = 5000;
// const testDonat = {
//   sum_donation: 50,
//   username: "tester",
//   donation_message:
//     "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Architecto, optio deleniti. Placeat facilis cupiditate dolorem aspernatur quaerat magnam soluta, ratione ullam commodi provident officiis nobis quasi corporis atque? Numquam, necessitatibus!",
// };

const DonatMessageContainer = () => {
  const dispatch = useDispatch();
  const { list } = useAppSelector(({ notifications }) => notifications);
  const { id } = useAppSelector(({ personInfo }) => personInfo);
  const { name } = useParams();

  const [lastNotif, setLastNotif] = useState<INotification | null>(null);

  const [alertWidgetData, setAlertWidgetData] = useState<IAlert>({
    ...initAlertData,
  });

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
        playSound(sound);
        setTimeout(() => {
          const { duration } = alertWidgetData;
          if (voice && donation_message) {
            const tmp = new Audio(
              `${baseURL}/api/widget/sound/generate?text=${donation_message}&gender_voice=${gender_voice}`
            );
            tmp.play();
          }
          setTimeout(() => {
            setLastNotif(null);
          }, duration * 1000);
        }, maxDuration);
      }
    }
  }, [lastNotif]);

  const getAlertsWidgetData = async () => {
    const { data } = await axiosClient.get(
      `/api/widget/get-alerts-widget/${id}`
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
  };

  useEffect(() => {
    id && getAlertsWidgetData();
  }, [id]);

  useEffect(() => {
    name && dispatch(tryToGetPersonInfo(name));
  }, [name]);

  // const blockchainImg = useMemo(() => {
  //   const currBlockchain = walletsConf[
  //     process.env.REACT_APP_WALLET || "metamask"
  //   ].blockchains.find((b) => b.nativeCurrency.symbol === lastNotif.blockchain);
  //   if (currBlockchain) return currBlockchain.icon;
  //   return "";
  // }, [lastNotif]);

  const { banner, message_color, name_color, sum_color } = alertWidgetData;

  return (
    <div className="donat-messsage-container">
      {lastNotif && lastNotif.donation && (
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
              {lastNotif.username && lastNotif.donation.sum_donation && (
                <>
                  <span
                    style={{
                      color: name_color,
                    }}
                  >
                    {lastNotif.username}&nbsp;
                  </span>
                  &nbsp; -&nbsp;
                  <span
                    style={{
                      color: sum_color,
                    }}
                  >
                    {lastNotif.donation.sum_donation}{" "}
                    {lastNotif.donation.blockchain}
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
            {lastNotif.donation.donation_message}
          </p>
        </>
      )}
    </div>
  );
};

export default DonatMessageContainer;
