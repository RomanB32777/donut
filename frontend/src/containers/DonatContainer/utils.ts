import { AnyAction, Dispatch } from "redux";
import { Socket } from "socket.io-client";
import request from "axios";
import {
  IFullSendDonat,
  ISocketEmitObj,
  ISendDonat,
  IShortUserData,
  IUser,
} from "types";

import { connectSocket } from "contexts/Websocket";
import axiosClient from "modules/axiosClient";
import { tryToGetUser } from "store/types/User";
import { getNotifications } from "store/types/Notifications";
import { addNotification, addErrorNotification, checkIsExistUser } from "utils";
import { IWalletConf, ProviderRpcError } from "appTypes";

const registerSupporter = async ({
  username,
  wallet_address, // sender address
  dispatch,
}: {
  username: string;
  wallet_address: string;
  dispatch: Dispatch<AnyAction>;
}): Promise<IUser | null> => {
  try {
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
  } catch (error) {
    if (request.isAxiosError(error)) {
      const { response } = error;
      if (response) {
        const { data } = response;
        addErrorNotification({
          title: "Registration error",
          message: (data as any).message,
        });
      }
    }
    return null;
  }
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
      const emitObj: ISocketEmitObj = {
        supporter: {
          username: userInfo.username,
          id: userInfo.id,
        },
        creator: {
          username: personInfo.username,
          id: data.creator_id,
        },
        id: data.id,
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
  userID,
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
  userID: number;
  socket: Socket | null;
  usdtKoef: number;
  balance: number;
  personInfo: IUser;
  walletConf: IWalletConf;
  dispatch: Dispatch<AnyAction>;
  setLoading: (state: boolean) => void;
  setIsOpenSuccessModal: (state: boolean) => void;
}) => {
  try {
    const { amount, username } = form;
    const walletData = await walletConf.getWalletData();

    if (walletData && walletData.address) {
      const { signer, address } = walletData;
      const { wallet_address } = personInfo;

      if (address !== wallet_address) {
        setLoading(true);

        if (!userID) {
          const isExistUser = await checkIsExistUser(username);
          if (isExistUser) {
            addNotification({
              type: "warning",
              title:
                "Unfortunately, this username is already busy. Enter another one",
            });
            return;
          }
        }

        if (balance >= Number(amount)) {
          const currentBlockchain = await walletConf.getCurrentBlockchain();

          if (currentBlockchain) {
            const res =
              await walletConf.transfer_contract_methods.paymentMethod({
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
    const errInfo = error as ProviderRpcError;

    errInfo.code !== "ACTION_REJECTED" &&
      addNotification({
        type: "danger",
        title: "Error",
        message:
          errInfo.reason ||
          (error as any)?.response?.data?.message ||
          (error as Error).message ||
          `An error occurred while sending data`,
      });
  } finally {
    setLoading(false);
  }
};

export { registerSupporter, sendDonation, triggerContract };
