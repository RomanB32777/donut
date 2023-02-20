import { useContext, useState } from "react";
import { Socket } from "socket.io-client";
import { ISocketEmitObj, ISendDonat, IUser } from "types";

import { useSocketConnection, WebSocketContext } from "contexts/Websocket";
import { WalletContext } from "contexts/Wallet";
import { addNotification } from "utils";
import { useEditGoalMutation } from "store/services/GoalsService";
import {
  useLazyCheckIsExistUserQuery,
  useRegisterUserMutation,
} from "store/services/UserService";
import { useCreateDonationMutation } from "store/services/DonationsService";
import { useLazyGetNotificationsQuery } from "store/services/NotificationsService";
import { ProviderRpcError } from "appTypes";

const usePayment = ({
  form,
  supporterInfo,
  creatorInfo,
  usdtKoef,
  balance,
}: {
  form: ISendDonat;
  supporterInfo: IUser;
  creatorInfo: IUser;
  usdtKoef: number;
  balance: number;
}) => {
  const { amount, selectedGoal, username } = form;

  const socket = useContext(WebSocketContext);
  const walletConf = useContext(WalletContext);

  const { connectSocket } = useSocketConnection(username);
  const [createDonation] = useCreateDonationMutation();
  const [registerUser] = useRegisterUserMutation();
  const [getNotifications] = useLazyGetNotificationsQuery();
  const [checkIsExistUser] = useLazyCheckIsExistUserQuery();
  const [editGoal] = useEditGoalMutation();

  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const registerSupporter = async () => {
    try {
      const walletData = await walletConf.getWalletData();

      if (walletData) {
        const { username } = form;
        const { address } = walletData;

        const userDadta = await registerUser({
          ...supporterInfo,
          username,
          wallet_address: address,
          roleplay: "backers",
        }).unwrap();
        return userDadta;
      }
    } catch (error) {
      console.log(error);
      setIsSuccess(false);
    }
  };

  const sendDonation = async () => {
    try {
      let userInfo: IUser | undefined = supporterInfo;
      let socketInfo: Socket | null = socket;

      if (!userInfo.id) {
        userInfo = await registerSupporter();
        socketInfo = connectSocket();
      }

      if (userInfo) {
        const donationData = await createDonation({
          ...form,
          creator: creatorInfo.id,
          backer: userInfo.id,
        }).unwrap();

        if (donationData) {
          const emitObj: ISocketEmitObj = {
            supporter: {
              username: userInfo.username,
              id: userInfo.id,
            },
            creator: {
              username: creatorInfo.username,
              id: donationData.creator_id,
            },
            id: donationData.id,
          };

          if (socketInfo) socketInfo.emit("new_donat", emitObj);
          else console.log("not connected user");

          if (selectedGoal)
            await editGoal({
              donat: amount * usdtKoef,
              creator_id: donationData.creator_id,
              id: selectedGoal,
              isVisibleNotification: false,
            });

          await getNotifications({
            user: userInfo.username,
            shouldUpdateApp: true,
          });

          setIsSuccess(true);
        } else setIsSuccess(false);
      }
    } catch (error) {
      setIsSuccess(false);
    }
  };

  const triggerContract = async () => {
    try {
      const walletData = await walletConf.getWalletData();

      const { amount, username } = form;

      if (walletData) {
        const { signer, address } = walletData;
        const { wallet_address } = creatorInfo;

        if (address !== wallet_address) {
          setIsLoading(true);

          if (!supporterInfo.id) {
            const { data: isExistUser } = await checkIsExistUser(username);

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
              // const res =
              //   await walletConf.transfer_contract_methods.paymentMethod({
              //     contract: currentBlockchain.address,
              //     addressTo: wallet_address,
              //     sum: String(amount),
              //     signer,
              //   });

              // if (res)
              await sendDonation();
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
      setIsLoading(false);
    }
  };

  return {
    registerSupporter,
    sendDonation,
    triggerContract,
    isSuccess,
    isLoading,
  };
};

export { usePayment };
