import { IWalletConf } from "appTypes";
import { AnyAction, Dispatch } from "redux";
import { Socket } from "socket.io-client";
import {
  IFullSendDonat,
  INewDonatSocketObj,
  ISendDonat,
  IShortUserData,
  IUser,
} from "types";

import { connectSocket } from "components/Websocket";
import axiosClient from "modules/axiosClient";
import { tryToGetUser } from "store/types/User";
import { getNotifications } from "store/types/Notifications";
import { addNotification } from "utils";

const registerSupporter = async ({
  username,
  walletConf,
  dispatch,
}: {
  username: string;
  walletConf: IWalletConf;
  dispatch: Dispatch<AnyAction>;
}): Promise<IUser | null> => {
  const { data } = await axiosClient.get(
    `/api/user/check-username/${username}`
  );

  if (data.error) {
    console.log(data.error);
    return null;
  }

  const blockchainData = await walletConf.getBlockchainData();
  if (blockchainData) {
    const { address } = blockchainData;
    const { data, status } = await axiosClient.post("/api/user/", {
      username,
      roleplay: "backers",
      wallet_address: address,
    } as IShortUserData);

    if (status === 200) {
      dispatch(tryToGetUser(address));
      return data;
    }
  }
  return null;
};

const sendDonation = async ({
  form,
  user,
  socket,
  usdtKoef,
  personInfo,
  walletConf,
  dispatch,
  setIsOpenSuccessModal,
}: {
  form: ISendDonat;
  user: IUser;
  socket: Socket | null;
  usdtKoef: number;
  personInfo: IUser;
  walletConf: IWalletConf;
  dispatch: Dispatch<AnyAction>;
  setIsOpenSuccessModal: (state: boolean) => void;
}) => {
  const { username, selectedBlockchain, amount, message, selectedGoal } = form;

  let userInfo: IUser | null = user;
  let newSocket: Socket | null = null;

  if (!userInfo.id) {
    userInfo = await registerSupporter({ username, walletConf, dispatch });
    newSocket = userInfo && connectSocket(userInfo.username, dispatch);
  }

  if (selectedBlockchain && userInfo) {
    const { data } = await axiosClient.post("/api/donation/", {
      creator_address: personInfo.wallet_address,
      backer_address: userInfo.wallet_address,
      amount,
      selectedBlockchain,
      message,
      selectedGoal: selectedGoal || null,
    } as IFullSendDonat);

    if (data.donation) {
      const emitObj: INewDonatSocketObj = {
        supporter: {
          username: userInfo.username,
          id: userInfo.id,
        },
        creator: {
          username: personInfo.username,
          id: data.donation.creator_id,
        },
        blockchain: selectedBlockchain, // "tEVMOS"
        sum: amount,
        donation_id: data.donation.id,
      };

      if (socket) socket.emit("new_donat", emitObj);
      else if (newSocket) newSocket.emit("new_donat", emitObj);
      else console.log("not connected user");

      selectedGoal &&
        (await axiosClient.put("/api/widget/goals-widget/", {
          goalData: {
            donat: amount * usdtKoef,
          },
          creator_id: data.donation.creator_id,
          id: selectedGoal,
        }));

      dispatch(getNotifications({ user: userInfo.username }));
      setIsOpenSuccessModal(true);
    }
  }
};

const triggerContract = async ({
  form,
  user,
  socket,
  usdtKoef,
  balance,
  personInfo,
  walletConf,
  dispatch,
  setLoading,
  setIsOpenSuccessModal,
}: {
  form: ISendDonat;
  user: IUser;
  socket: Socket | null;
  usdtKoef: number;
  balance: number;
  personInfo: IUser;
  walletConf: IWalletConf;
  dispatch: Dispatch<AnyAction>;
  setLoading: (state: boolean) => void;
  setIsOpenSuccessModal: (state: boolean) => void;
}) => {
  const { amount, username } = form;
  if (amount && username) {
    try {
      const blockchainData = await walletConf.getBlockchainData();

      if (blockchainData && blockchainData.address) {
        const { signer, address } = blockchainData;
        const { wallet_address } = personInfo;

        if (address !== wallet_address) {
          setLoading(true);

          if (balance >= Number(amount)) {
            const currentBlockchain = await walletConf.getCurrentBlockchain()

            if (currentBlockchain) {
              const res = await walletConf.paymentMethod({
                contract: currentBlockchain.address,
                addressTo: wallet_address,
                sum: String(amount),
                signer,
              });

              res &&
                (await sendDonation({
                  form,
                  user,
                  socket,
                  usdtKoef,
                  personInfo,
                  walletConf,
                  dispatch,
                  setIsOpenSuccessModal,
                }));
            }
          } else {
            addNotification({
              type: "warning",
              title: "Insufficient balance",
              message:
                "Unfortunately, there are not enough funds on your balance to carry out the operation",
            });
          }
        } else {
          addNotification({
            type: "warning",
            title: "Seriously ?)",
            message: "You are trying to send a donation to yourself",
          });
        }
      }
    } catch (error) {
      console.log("error", error);
      addNotification({
        type: "danger",
        title: "Error",
        message:
          (error as any)?.response?.data?.message ||
          (error as Error).message ||
          `An error occurred while sending data`,
      });
    } finally {
      setLoading(false);
    }
  } else {
    addNotification({
      type: "warning",
      title: "Not all fields are filled",
    });
  }
};

export { registerSupporter, sendDonation, triggerContract };
