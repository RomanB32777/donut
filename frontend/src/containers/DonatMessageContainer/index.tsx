import { useEffect, useState } from "react";
import useSound from "use-sound";
import clsx from "clsx";
import ReactPlayer from "react-player";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { tryToGetPersonInfo } from "../../store/types/PersonInfo";

import bigImg from "../../assets/big_don.png";
import axiosClient from "../../axiosClient";
import { IAlertData, initAlertData } from "../../types";
import { url } from "../../consts";
import { soundsList } from "../../assets/sounds";
import EvmosIMG from "../../assets/evmos.png";
// import textToSpeech from "@google-cloud/text-to-speech";
import "./styles.sass";

// const client = new textToSpeech.TextToSpeechClient();

const testDonat = {
  wallet_type: "metamask",
  sum_donation: 50,
  username: "tester",
  donation_message:
    "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Architecto, optio deleniti. Placeat facilis cupiditate dolorem aspernatur quaerat magnam soluta, ratione ullam commodi provident officiis nobis quasi corporis atque? Numquam, necessitatibus!",
};

const DonatMessageContainer = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.personInfo).main_info;
  const notifications = useSelector((state: any) => state.notifications);
  const { name } = useParams();

  const [lastNotif, setLastNotif] = useState<any>({
    // ...testDonat
  });

  const [isPlay, setIsPlay] = useState<boolean>(false);

  const [alertWidgetData, setAlertWidgetData] = useState<IAlertData>({
    ...initAlertData,
  });

  const blobToBase64 = (blob: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return new Promise((resolve) => {
      reader.onloadend = () => {
        resolve(reader.result);
      };
    });
  };

  const generateSound = async () => {
    try {
      const { data } = await axiosClient.post(
        "/api/user/generate/sound",
        {
          text: "HELLO",
        }
        // {
        //   responseType: "arraybuffer",
        //   headers: { Accept: "*/*", "Content-Type": "audio/wav" },
        // }
      );

      const audioBlob = new Blob([data]);
      const url = URL.createObjectURL(audioBlob);

      setAlertWidgetData({
        ...alertWidgetData,
        sound: data,
      });
      setIsPlay(true);

      // const audioBlob = new Blob([data]);
      // blobToBase64(audioBlob).then((base64Data) => {
      //   const file = "data:audio/webm;base64," + base64Data;
      //   console.log(base64Data);
      // // const audioUrl = URL.createObjectURL(audioBlob);

      //   // const formData = new FormData();
      //   // formData.append('file', file);
      //   // return fetch(url, {
      //   //     method: 'POST',
      //   //     body: formData
      //   // }).then(res => res.json())
      //  })

      // const audioBlob = new Blob([data]);
      // const audioUrl = URL.createObjectURL(audioBlob);
      // console.log(audioUrl);

      // const audio = new Audio(audioUrl);
      // console.log(audio);

      // audio
      //   .play()
      //   .then((res) => console.log(res))
      //   .catch(console.log);
      // console.log("fgdg", data);

      // const blob = new Blob([data], {
      //   type: "audio/mp3",
      // });
      // const url = URL.createObjectURL(blob);

      // console.log(url);

      // fetch(url)
      //   .then((res) => res.blob())
      //   .then((blob) => {
      //     const reader = new FileReader();
      //     // reader.onload = function (e) {
      //     //   const srcUrl = url;
      //     //   audioNode.src = srcUrl;
      //     // };
      //     // reader.readAsDataURL(blob);
      //   });

      // var newSource = audioContext.createBufferSource();
      // var newBuffer = audioContext.createBuffer(
      //   2,
      //   buffers[0].length,
      //   audioContext.sampleRate
      // );
      // newBuffer.getChannelData(0).set(buffers[0]);
      // newBuffer.getChannelData(1).set(buffers[1]);
      // newSource.buffer = newBuffer;

      // newSource.connect(audioContext.destination);
      // newSource.start(0);

      // setAlertWidgetData({
      //   ...alertWidgetData,
      //   sound: url,
      // });
      //   const  =  await axios.get(`http://api.url`,
      // }).then(resp => resp);
      // const blob = new Blob([data], {
      //     type: 'audio/wav'
      // })
      // const url = URL.createObjectURL(blob);

      // fetch(url)
      //     .then(res => res.blob())
      //     .then(blob => fileDownload(blob, 'your_filename'))
      //     .catch(e => console.log('ERROR DOWNLOADING AUDIO FILE'));
    } catch (e) {
      console.log(`api, ${e}`);
    }
  };

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
    // generateSound();
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
    // getAlertsWidgetData(user);
  }, [user]);

  const { banner, message_color, name_color, sum_color, sound } =
    alertWidgetData;

  const [play, { duration }] = useSound(soundsList[sound]);

  return (
    <div className="donat-messsage-container">
      {/* {isPlay && <ReactPlayer url={sound} />} */}

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
