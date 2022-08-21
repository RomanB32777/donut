import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { closeModal, OPEN_SUPPORT_MODAL } from "../../store/types/Modal";
import LogoIcon from "../../icons/LogoIcon";
import "./styles.sass";
import {
  MaticIcon,
  NonSuccessTransactionIcon,
  SmallToggleListArrowIcon,
  SuccessTransactionIcon,
  TronIcon,
} from "../../icons/icons";
import getTronWallet, {
  getMetamaskData,
  getMetamaskWallet,
  metamaskWalletIsIntall,
  tronWalletIsIntall,
} from "../../functions/getTronWallet";
import axiosClient from "../../axiosClient";
import {
  abiOfContract,
  contractAddress,
  contractMetaAddress,
} from "../../consts";
import { send } from "process";
import { getPersonInfoPage } from "../../store/types/PersonInfo";
import { addAuthNotification, addNotification } from "../../utils";
import { WebSocketContext } from "../Websocket/WebSocket";
import clsx from "clsx";
import Web3 from "web3";
import postData from "../../functions/postData";
import { tryToGetUser } from "../../store/types/User";
import { ethers } from "ethers";
// const TronWeb = require('tronweb')
// const tronWeb = new TronWeb()

const wallets = [
  {
    name: "MATIC",
    icon: <MaticIcon />,
  },
  {
    name: "TRX",
    icon: <TronIcon />,
  },
];

const SupportModal = ({
  modificator,
  notTitle,
  setForm,
  additionalFields,
}: {
  modificator?: string;
  notTitle?: boolean;
  setForm?: any;
  additionalFields?: any;
}) => {
  const { pathname } = useLocation();

  const dispatch = useDispatch();

  const data = useSelector((state: any) => state.personInfo).main_info;
  const user = useSelector((state: any) => state.user);
  const { wallet, token } = useSelector((state: any) => state.wallet);

  const socket = useContext(WebSocketContext);

  const [sum, setSum] = useState<string>("0");
  const [isOpenSelect, setOpenSelect] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<any>({});
  const [visibleWallet, setVisibleWallet] = useState<any>([]);
  const [tronUsdtKoef, setTronUsdtKoef] = useState<string>("0");
  const [maticUsdtKoef, setMaticUsdtKoef] = useState<string>("0");
  const [loadingState, setLoadingState] = useState(false);

  const [sent, setSent] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(true);

  const getPrice = async () => {
    const res: any = await axiosClient.get(
      "https://www.binance.com/api/v3/ticker/price?symbol=TRXUSDT"
    );
    setTronUsdtKoef(res.data.price);
  };

  const getMaticUsdKoef = async () => {
    const res: any = await axiosClient.get(
      "https://www.binance.com/api/v3/ticker/price?symbol=MATICUSDT"
    );
    setMaticUsdtKoef(res.data.price);
  };

  useEffect(() => {
    if (wallet && token) {
      if (wallet === "metamask") {
        data.metamask_token
          ? setSelectedWallet(wallets[0])
          : setSelectedWallet(wallets[1]);
      }
      if (wallet === "tron") {
        data.tron_token
          ? setSelectedWallet(wallets[1])
          : setSelectedWallet(wallets[0]);
      }
    } else {
      if (tronWalletIsIntall() && getTronWallet())
        setSelectedWallet(wallets[1]);
      else if (metamaskWalletIsIntall()) {
        getMetamaskWallet().then((token) => {
          if (token) setSelectedWallet(wallets[0]);
        });
      }
    }
  }, [wallet, token, data]);

  // useEffect(() => {
  //   const filters = wallets.filter((wallet) => {
  //     console.log(wallet);

  //     if (Object.keys(user).length) {
  //       if (wallet.name === "TRX" && user.tron_token && data.tron_token) {
  //         // setVisibleWallet([...visibleWallet, wallet]);
  //         return true;
  //       }
  //       if (
  //         wallet.name === "MATIC" &&
  //         user.metamask_token &&
  //         data.metamask_token
  //       ) {
  //         return true;
  //         // setVisibleWallet([...visibleWallet, wallet]);
  //       }
  //     } else {
  //       if (metamaskWalletIsIntall()) {
  //         let flag = false;
  //         getMetamaskWallet().then((res) => {
  //           if (res && wallet.name === "MATIC") {
  //             flag = Boolean(
  //               wallet.name === "MATIC" && res && data.metamask_token
  //             );
  //             console.log("FJF");

  //             // true;
  //             // && setVisibleWallet([...visibleWallet, wallet]);
  //           }
  //         });
  //         console.log("<LMKD", flag);

  //         return flag;
  //       }
  //       if (tronWalletIsIntall() && wallet.name === "TRX") {
  //         return Boolean(
  //           wallet.name === "TRX" && getTronWallet() && data.tron_token
  //         );
  //       }
  //     }
  //     return false;
  //   });

  //   console.log(filters);
  // }, [user, data]);

  useEffect(() => {
    const asyncFilter = async (arr: any, predicate: any) => {
      const results = await Promise.all(arr.map(predicate));

      return arr.filter((_v: any, index: any) => results[index]);
    };

    asyncFilter(wallets, async (wallet: any) => {
      if (Object.keys(user).length) {
        return (
          Boolean(
            wallet.name === "TRX" && user.tron_token && data.tron_token
          ) ||
          Boolean(
            wallet.name === "MATIC" &&
              user.metamask_token &&
              data.metamask_token
          )
        );
      }
      if (metamaskWalletIsIntall()) {
        const met = await getMetamaskWallet();
        if (met && wallet.name === "MATIC") {
          return Boolean(wallet.name === "MATIC" && met && data.metamask_token);
        }
      }
      if (tronWalletIsIntall() && wallet.name === "TRX") {
        return Boolean(
          wallet.name === "TRX" && getTronWallet() && data.tron_token
        );
      }
    })
      .then((res) => {
        setVisibleWallet(res);
        res.length && setSelectedWallet(res[0]);
      })
      .catch(console.error);
  }, [user, data]);

  useEffect(() => {
    getPrice();
    getMaticUsdKoef();

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

  const sendDonation = async (newUser?: any) => {
    if (
      selectedWallet &&
      selectedWallet.name === "TRX" &&
      (user.tron_token || newUser.tron_token)
    ) {
      const res = await axiosClient.post("/api/donation/create/", {
        creator_token: data.tron_token,
        backer_token: user.tron_token || newUser.tron_token,
        sum: sum.toString(),
        wallet: "tron",
        donation_message: additionalFields ? additionalFields.message : "",
      });
      if (res.status === 200) {
        setSent(true);
        const resData = res.data;

        if (resData.message === "success") {
          socket &&
            user &&
            resData.donation &&
            socket.emit("new_donat", {
              supporter: {
                username: user.username || newUser.username,
                id: user.user_id || newUser.user_id,
              },
              wallet: "tron",
              creator_id: data.user_id,
              sum: sum.toString(),
              donationID: resData.donation.id,
            });
          dispatch(
            getPersonInfoPage({
              page: "supporters",
              username: pathname.slice(pathname.indexOf("@")),
            })
          );

          setSum(resData.donation.sum_donation);
          setSuccess(true);
          setForm({
            message: "",
            username: "",
          });
          // setTimeout(() => {
          //   dispatch(closeModal());
          //   setSum("0");
          // }, 5000);
        } else {
          setTimeout(() => {
            setSent(false);
            // setSum("0");
          }, 3500);
        }
      }
    } else if (
      selectedWallet &&
      selectedWallet.name === "MATIC" &&
      (user.metamask_token || newUser.metamask_token)
    ) {
      const res = await axiosClient.post("/api/donation/create/", {
        creator_token: data.metamask_token,
        backer_token: user.metamask_token || newUser.metamask_token,
        sum: sum.toString(),
        wallet: "metamask",
        donation_message: additionalFields ? additionalFields.message : "",
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
              supporter: {
                username: user.username || newUser.username,
                id: user.user_id || newUser.user_id,
              },
              wallet: "metamask",
              creator_id: data.user_id,
              sum: sum.toString(),
              donationID: resData.donation.id,
            });
          dispatch(
            getPersonInfoPage({
              page: "supporters",
              username: pathname.slice(pathname.indexOf("@")),
            })
          );

          setSum(resData.donation.sum_donation);
          setSuccess(true);
          setForm({
            message: "",
            username: "",
          });
          // setTimeout(() => {
          //   dispatch(closeModal());
          // }, 5000);
        } else {
          setTimeout(() => {
            setSent(false);
            // setSum("0");
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

  const getWeb3 = (ethereum: any) =>
    new Promise((resolve) => {
      let currentWeb3;

      if (ethereum) {
        currentWeb3 = new Web3(ethereum);
        try {
          // Request account access if needed
          ethereum.enable();
          // Acccounts now exposed
          resolve(currentWeb3);
        } catch (error) {
          // User denied account access...
          alert("Please allow access for the app to work");
        }
      } else if ((window as any).web3) {
        // (window as any).web3 = new Web3(Web3.currentProvider);
        // // Acccounts always exposed
        // resolve(currentWeb3);
      } else {
        console.log(
          "Non-Ethereum browser detected. You should consider trying MetaMask!"
        );
      }
    });

  async function triggerContract() {
    if (Number(sum) <= 0.2) {
      setSum(".2");
    }
    try {
      if (selectedWallet.name === "TRX") {
        if (user.tron_token) {
          let instance = await (window as any).tronWeb
            .contract()
            .at(contractAddress);
          const res = await instance.transferMoney(data.tron_token).send({
            feeLimit: 100_000_000,
            callValue: 1000000 * parseFloat(sum), // это 100 trx
            shouldPollResponse: false,
          });
          if (res) {
            sendDonation();
          }
        } else if (additionalFields && additionalFields.username) {
          const res = await postData("/api/user/check-username", {
            username: additionalFields.username,
          });

          if (!res.error) {
            const metaMaskWallet =
              metamaskWalletIsIntall() && (await getMetamaskWallet());

            const walletCheck =
              token ||
              (selectedWallet.name === "TRX"
                ? getTronWallet()
                : metaMaskWallet);
                
            if (walletCheck) {
              const resCreate = await postData("/api/user/create-user", {
                role: "backers",
                username: additionalFields.username,
                token: walletCheck,
                typeWallet:
                  wallet ||
                  (selectedWallet.name === "TRX" ? "tron" : "metamask"),
              });

              if (resCreate.newUser) {
                dispatch(tryToGetUser(walletCheck));
                let instance = await (window as any).tronWeb
                  .contract()
                  .at(contractAddress);
                const res = await instance.transferMoney(data.tron_token).send({
                  feeLimit: 100_000_000,
                  callValue: 1000000 * parseFloat(sum), // это 100 trx
                  shouldPollResponse: false,
                });

                if (res) {
                  sendDonation(resCreate.newUser);
                }
              }
            } else
              addNotification({
                type: "danger",
                title: "Donat error",
              });
          }
        } else {
          addNotification({
            type: "danger",
            title: "TronLink error",
            message:
              "An error occurred while authorizing the wallet in tronlink",
          });
        }
      }
      if (selectedWallet.name === "MATIC") {
        if (metamaskWalletIsIntall()) {
          if (user.metamask_token) {
            const metamaskData = await getMetamaskData();
            if (metamaskData) {
              const { signer } = metamaskData;
              const smartContract = new ethers.Contract(
                contractMetaAddress,
                abiOfContract,
                signer
              );

              const tx = await smartContract.transferMoney(
                data.metamask_token,
                {
                  value: ethers.utils.parseEther(sum),
                }
              );
              try {
                setLoadingState(true);
                await tx.wait(); // Это чтобы дождаться, когда транзация будет замайнена в блок
                setLoadingState(false);
                sendDonation();
              } catch (error) {
                setLoadingState(false);
                console.log(error);
              }
            }
          } else if (additionalFields && additionalFields.username) {
            const res = await postData("/api/user/check-username", {
              username: additionalFields.username,
            });

            if (!res.error) {
              const metaMaskWallet =
                metamaskWalletIsIntall() && (await getMetamaskWallet());

              const walletCheck =
                token ||
                (selectedWallet.name === "TRX"
                  ? getTronWallet()
                  : metaMaskWallet);
              if (walletCheck) {
                const resCreate = await postData("/api/user/create-user", {
                  role: "backers",
                  username: additionalFields.username,
                  token: walletCheck,
                  typeWallet:
                    wallet ||
                    (selectedWallet.name === "TRX" ? "tron" : "metamask"),
                });

                if (resCreate.newUser) {
                  dispatch(tryToGetUser(walletCheck));

                  const metamaskData = await getMetamaskData();
                  if (metamaskData) {
                    const { signer } = metamaskData;
                    const smartContract = new ethers.Contract(
                      contractMetaAddress,
                      abiOfContract,
                      signer
                    );

                    const tx = await smartContract.transferMoney(
                      data.metamask_token,
                      {
                        value: ethers.utils.parseEther(sum),
                      }
                    );
                    try {
                      setLoadingState(true);
                      await tx.wait(); // Это чтобы дождаться, когда транзация будет замайнена в блок
                      setLoadingState(false);
                      sendDonation(resCreate.newUser);
                    } catch (error) {
                      setLoadingState(false);
                      console.log(error);
                    }
                  }
                }
              } else
                addNotification({
                  type: "danger",
                  title: "Donat error",
                });
            }
          } else {
            addNotification({
              type: "danger",
              title: "Metamask error",
              message:
                "An error occurred while authorizing the wallet in metamask",
            });
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div
      className={clsx("support-modal", {
        [`support-modal__${modificator}`]: modificator,
      })}
      // style={{
      //   height: sent ? "300px" : "512px",
      //   width: sent ? "600px" : "436px",
      // }}
    >
      {loadingState && (
        <div className="loading-transaction">
          <span>Loading...</span>
          <span>
            Don't close the site until the result of the transaction is loaded
          </span>
        </div>
      )}
      {!sent && !loadingState ? (
        <>
          {!notTitle && (
            <>
              <div className="support-modal__logo">
                <LogoIcon />
              </div>
              <span className="support-modal__title">
                Become supporter of
                {" " + pathname.slice(pathname.lastIndexOf("/") + 1)}
              </span>
            </>
          )}
          <div className="support-modal__form">
            <span className="support-modal__form__title">
              Choose the donation sum below
            </span>
            <div className="support-modal__form__input">
              <input
                type="text"
                className="support-modal__form__input__inp"
                onChange={(event) => {
                  if (sum === "0") {
                    setSum(event.target.value.slice(1));
                  } else {
                    setSum(event.target.value);
                  }
                }}
                value={sum}
              />
              <div
                className="support-modal__form__input__tron-panel"
                onClick={() => {
                  visibleWallet.length > 1 && setOpenSelect(!isOpenSelect);
                }}
              >
                {selectedWallet && selectedWallet.icon}
                {/* <TronIcon /> */}
                <span className="support-modal__form__input__tron-panel__title">
                  {/* TRX */}
                  {selectedWallet && selectedWallet.name}
                </span>
                {visibleWallet.length > 1 && (
                  <div className={clsx({ rotated: isOpenSelect })}>
                    <SmallToggleListArrowIcon />
                  </div>
                )}
                {isOpenSelect && (
                  <div className="support-popup__select_wallet">
                    {visibleWallet.length > 1 &&
                      visibleWallet.map(
                        (
                          { name, icon }: { name: any; icon: any },
                          key: number
                        ) => (
                          <div
                            className="support-popup__select_wallet-item"
                            key={key}
                          >
                            <div
                              className="support-popup__select_wallet-item__content"
                              onClick={() => setSelectedWallet({ name, icon })}
                            >
                              <div className="support-popup__select_wallet-item__img">
                                {icon}
                              </div>
                              <span className="support-popup__select_wallet-item__name">
                                {name}
                              </span>
                            </div>
                          </div>
                        )
                      )}
                  </div>
                )}
              </div>
            </div>
            <div className="support-modal__form__input">
              <span className="support-modal__form__input__title">
                {sum.length > 0
                  ? parseFloat(sum) *
                    parseFloat(
                      selectedWallet.name === "TRX"
                        ? tronUsdtKoef
                        : maticUsdtKoef
                    )
                  : "0"}
              </span>
              <span
                className="support-modal__form__input__subtitle"
                style={{
                  paddingRight: visibleWallet.length > 1 ? "32px" : "0",
                }}
              >
                USDT
              </span>
            </div>
            <div
              className={clsx("support-modal__form__button", {
                "support-modal__form__button-disabled":
                  (user.metamask_token &&
                    !user.tron_token &&
                    data.tron_token &&
                    !data.metamask_token) ||
                  (!user.metamask_token &&
                    user.tron_token &&
                    !data.tron_token &&
                    data.metamask_token),
              })}
              onClick={() => triggerContract()}
            >
              Support
            </div>
          </div>
        </>
      ) : success && !loadingState ? (
        <div className="success-transaction">
          <span>
            You’ve successfully sent {sum} {selectedWallet.name} to{" "}
            {" " + pathname.slice(pathname.lastIndexOf("/") + 1)}
          </span>
          <SuccessTransactionIcon />
        </div>
      ) : (
        !loadingState && (
          <div className="non-success-transaction">
            <span>Something wrong happened. Try again</span>
            <NonSuccessTransactionIcon />
          </div>
        )
      )}
    </div>
  );
};

export default SupportModal;
