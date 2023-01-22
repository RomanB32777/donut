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
  wallet_address, // sender address
  dispatch,
}: {
  username: string;
  wallet_address: string;
  dispatch: Dispatch<AnyAction>;
}): Promise<IUser | null> => {
  const checkedData = await axiosClient.get(
    `/api/user/check-username/${username}`
  );

  const { error } = checkedData.data;
  if (error) {
    console.log(checkedData.data.error);
    return null;
  }

  const { data, status } = await axiosClient.post("/api/user/", {
    username,
    roleplay: "backers",
    wallet_address,
  } as IShortUserData);

  if (status === 200) {
    dispatch(tryToGetUser(wallet_address));
    return data;
  }

  return null;
};

const sendDonation = async ({
  form,
  user,
  socket,
  usdtKoef,
  personInfo,
  wallet_address,
  dispatch,
  setIsOpenSuccessModal,
}: {
  form: ISendDonat;
  user: IUser;
  socket: Socket | null;
  usdtKoef: number;
  personInfo: IUser;
  wallet_address: string; // sender address
  dispatch: Dispatch<AnyAction>;
  setIsOpenSuccessModal: (state: boolean) => void;
}) => {
  const {
    username,
    selectedBlockchain,
    amount,
    message,
    selectedGoal,
    is_anonymous,
  } = form;

  let userInfo: IUser | null = user;
  let newSocket: Socket | null = null;

  if (!userInfo.id) {
    userInfo = await registerSupporter({
      username,
      wallet_address, // sender address
      dispatch,
    });
    newSocket = userInfo && connectSocket(userInfo.username, dispatch);
  }

  if (selectedBlockchain && userInfo) {
    const { data, status } = await axiosClient.post("/api/donation/", {
      creator: personInfo.id,
      backer: userInfo.id,
      amount,
      selectedBlockchain,
      message,
      selectedGoal: selectedGoal || null,
      is_anonymous,
    } as IFullSendDonat);

    if (status === 200 && data) {
      const emitObj: INewDonatSocketObj = {
        supporter: {
          username: userInfo.username,
          id: userInfo.id,
        },
        creator: {
          username: personInfo.username,
          id: data.creator_id,
        },
        donation_id: data.id,
      };

      if (socket) socket.emit("new_donat", emitObj);
      else if (newSocket) newSocket.emit("new_donat", emitObj);
      else console.log("not connected user");

      selectedGoal &&
        (await axiosClient.put("/api/widget/goals-widget/", {
          goalData: {
            donat: amount * usdtKoef,
          },
          creator_id: data.creator_id,
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
      const blockchainData = await walletConf.getWalletData();

      if (blockchainData && blockchainData.address) {
        const { signer, address } = blockchainData;
        const { wallet_address } = personInfo;

        if (address !== wallet_address) {
          setLoading(true);

          if (balance >= Number(amount)) {
            const currentBlockchain = await walletConf.getCurrentBlockchain();

            if (currentBlockchain) {
              const res = await walletConf.transfer_contract_methods.paymentMethod({
                contract: currentBlockchain.address,
                addressTo: wallet_address,
                sum: String(amount),
                signer,
              });

              if (res)
                await sendDonation({
                  form,
                  user,
                  socket,
                  usdtKoef,
                  personInfo,
                  wallet_address: address, // sender address
                  dispatch,
                  setIsOpenSuccessModal,
                });
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
