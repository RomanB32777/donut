import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { closeModal, OPEN_SUPPORT_MODAL } from "../../store/types/Modal";
import LogoIcon from "../../icons/LogoIcon";
import "./styles.sass";
import {
  NonSuccessTransactionIcon,
  SuccessTransactionIcon,
  TronIcon,
} from "../../icons/icons";
import getTronWallet from "../../functions/getTronWallet";
import axiosClient from "../../axiosClient";
import { contractAddress } from "../../consts";
import { send } from "process";
import { getPersonInfoPage } from "../../store/types/PersonInfo";
import { addAuthNotification } from "../../utils";
import { WebSocketContext } from "../Websocket/WebSocket";
// const TronWeb = require('tronweb')
// const tronWeb = new TronWeb()

const SupportModal = () => {
  const { pathname } = useLocation();

  const dispatch = useDispatch();

  const data = useSelector((state: any) => state.personInfo).main_info;
  const user = useSelector((state: any) => state.user);

  const socket = useContext(WebSocketContext);

  const tron_token = getTronWallet();

  const [tron, setTron] = useState<string>("0");
  const [tronUsdtKoef, setTronUsdtKoef] = useState<string>("0");

  const [sent, setSent] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(true);

  const getPrice = async () => {
    const res: any = await axiosClient.get(
      "https://www.binance.com/api/v3/ticker/price?symbol=TRXUSDT"
    );
    setTronUsdtKoef(res.data.price);
  };

  useEffect(() => {
    getPrice();

    const clickHandler = (event: React.MouseEvent<HTMLElement> | any) => {
      if (
        event.target &&
        event.target.className &&
        event.target.className === "modal-wrapper"
      ) {
        dispatch(closeModal());
      }
    };

    document.addEventListener("click", clickHandler);

    return () => {
      document.removeEventListener("click", clickHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendDonation = async () => {
    if (tron_token) {
      const res = await axiosClient.post("/api/donation/create/", {
        creator_tron_token: data.tron_token,
        backer_tron_token: tron_token,
        sum: tron.toString(),
      });
      if (res.status === 200) {
        setSent(true);
        //   const msg = await res.json();
        const resData = res.data;

        if (resData.message === "success") {
          socket &&
            user &&
            resData.donation &&
            socket.emit("new_donat", {
              supporter: { username: user.username, id: user.user_id },
              creator_id: data.user_id,
              sum: tron.toString(),
              donationID: resData.donation.id,
            });
          dispatch(
            getPersonInfoPage({
              page: "supporters",
              username: pathname.slice(pathname.indexOf("@")),
            })
          );

          setSuccess(true);
          setTimeout(() => {
            dispatch(closeModal());
            setTron("0");
          }, 5000);
        } else {
          setTimeout(() => {
            setSent(false);
            setTron("0");
          }, 3500);
        }
      }
    } else {
      addAuthNotification();
    }
    // const res = await fetch(  "/api/donation/create/", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json;charset=utf-8",
    //     "Access-Control-Allow-Origin": "*",
    //     "Access-Control-Allow-Credentials": "true",
    //     Accept: "application/json",
    //   },
    //   credentials: "include",
    //   // mode:'cors',
    //   referrerPolicy: "no-referrer",
    //   body: JSON.stringify({
    //     creator_tron_token: data.tron_token,
    //     backer_tron_token: tron_token,
    //     sum: tron.toString(),
    //   }),
    // });
  };

  async function triggerContract() {
    try {
      let instance = await (window as any).tronWeb
        .contract()
        .at(contractAddress);
      // const res = await instance.transferMoney(data.tron_token).send({
      //   feeLimit: 100_000_000,
      //   callValue: 1000000 * parseFloat(tron), // это 100 trx
      //   shouldPollResponse: false,
      // });

      // if (res) {
      // }
      sendDonation();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div
      className="support-modal"
      style={{
        height: sent ? "300px" : "512px",
        width: sent ? "600px" : "436px",
      }}
    >
      {!sent ? (
        <>
          <div className="support-modal__logo">
            <LogoIcon />
          </div>
          <span className="support-modal__title">
            Become supporter of
            {" " + pathname.slice(pathname.lastIndexOf("/") + 1)}
          </span>

          <div className="support-modal__form">
            <span className="support-modal__form__title">
              Choose the donation sum below
            </span>
            <div className="support-modal__form__input">
              <input
                type="text"
                className="support-modal__form__input__inp"
                onChange={(event) => {
                  if (tron === "0") {
                    setTron(event.target.value.slice(1));
                  } else {
                    setTron(event.target.value);
                  }
                }}
                value={tron}
              />
              <div className="support-modal__form__input__tron-panel">
                <TronIcon />
                <span className="support-modal__form__input__tron-panel__title">
                  TRX
                </span>
              </div>
            </div>
            <div className="support-modal__form__input">
              <span className="support-modal__form__input__title">
                {tron.length > 0
                  ? parseFloat(tron) * parseFloat(tronUsdtKoef)
                  : "0"}
              </span>
              <span className="support-modal__form__input__subtitle">USDT</span>
            </div>
            <div
              className="support-modal__form__button"
              onClick={() => triggerContract()}
            >
              Support
            </div>
          </div>
        </>
      ) : success ? (
        <div className="success-transaction">
          <span>
            You’ve successfully sent {tron} TRX to{" "}
            {" " + pathname.slice(pathname.lastIndexOf("/") + 1)}
          </span>
          <SuccessTransactionIcon />
        </div>
      ) : (
        <div className="non-success-transaction">
          <span>Something wrong happened. Try again</span>
          <NonSuccessTransactionIcon />
        </div>
      )}
    </div>
  );
};

export default SupportModal;
