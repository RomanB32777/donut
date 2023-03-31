import { useContext, useState } from "react";
import { Socket } from "socket.io-client";
import { RpcError, useAccount, useNetwork } from "wagmi";
import { prepareWriteContract, writeContract } from "@wagmi/core";
import { useIntl } from "react-intl";
import { ISocketEmitObj, ISendDonat, IUser } from "types";

import { useSocketConnection, WebSocketContext } from "contexts/Websocket";
import {
  useLazyCheckIsExistUserQuery,
  useCreateUserMutation,
  useLazyGetUserQuery,
} from "store/services/UserService";
import useAuth from "hooks/useAuth";
import { useActions } from "hooks/reduxHooks";
import { useCreateDonationMutation } from "store/services/DonationsService";
import { useLazyGetNotificationsQuery } from "store/services/NotificationsService";
import {
  addNotification,
  BlockchainNetworks,
  fullChainsInfo,
  removeAuthToken,
} from "utils";
import { IError } from "appTypes";
import { mainAbi } from "consts";
import { utils } from "ethers";

const usePayment = ({
  form,
  supporterInfo,
  creatorInfo,
  balance,
}: {
  form: ISendDonat;
  supporterInfo: IUser;
  creatorInfo: IUser;
  balance: number;
}) => {
  const { sum, username } = form;

  const intl = useIntl();
  const socket = useContext(WebSocketContext);
  const { address } = useAccount();
  const { chain: currentChain } = useNetwork();
  const { checkWebToken, checkWallet } = useAuth();
  const { logoutUser } = useActions();
  const { connectSocket } = useSocketConnection(username);
  const [createDonation] = useCreateDonationMutation();
  const [registerUser] = useCreateUserMutation();
  const [getNotifications] = useLazyGetNotificationsQuery();
  const [checkIsExistUser] = useLazyCheckIsExistUserQuery();
  const [getUser] = useLazyGetUserQuery();

  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const currentChainNetwork = currentChain?.network;

  const chainContract = currentChainNetwork
    ? fullChainsInfo[currentChainNetwork as BlockchainNetworks]?.contractAddress
    : undefined;

  const registerSupporter = async () => {
    try {
      let newUsername = username;
      if (address) {
        if (supporterInfo.id) {
          removeAuthToken();
          const isExistSupporter = await checkWallet();

          if (!isExistSupporter) {
            newUsername = `${username}Supporter`;
            logoutUser();
          }
        }
        await checkWebToken();
        const userDadta = await registerUser({
          username: newUsername,
          walletAddress: address,
          roleplay: "backers",
          isVisibleNotification: false,
        }).unwrap();
        return userDadta;
      } else setIsSuccess(false);
    } catch (error) {
      console.log(error);
      setIsSuccess(false);
    }
  };

  const sendDonation = async (userInfo: IUser, socket?: Socket | null) => {
    try {
      const donationData = await createDonation({
        ...form,
        creator: creatorInfo.id,
        backer: userInfo.id,
      }).unwrap();

      if (donationData) {
        const emitObj: ISocketEmitObj = {
          toSendUsername: userInfo.username,
          id: donationData.id,
        };

        if (socket) socket.emit("newDonat", emitObj);
        else console.log("not connected user");

        await getNotifications({
          username: userInfo.username,
          shouldUpdateApp: true,
        });

        setIsSuccess(true);
      } else setIsSuccess(false);
    } catch (error) {
      setIsSuccess(false);
    }
  };

  const triggerContract = async () => {
    try {
      if (address) {
        const { walletAddress, id } = creatorInfo;
        let userInfo: IUser | undefined = supporterInfo;
        let socketInfo: Socket | null = socket;

        if (address !== walletAddress && id !== userInfo.id) {
          setIsLoading(true);

          if (!userInfo.id) {
            const { data: isExistUser } = await checkIsExistUser(username);

            if (isExistUser) {
              addNotification({
                type: "warning",
                title: intl.formatMessage({
                  id: "donat_warning_message_username_description",
                }),
              });
              return;
            }
          }
          if (balance >= Number(sum)) {
            if (chainContract && currentChain) {
              if (!userInfo.id || userInfo.roleplay === "creators") {
                userInfo = await registerSupporter();
                // TODO можно ли без доп запроса ?
                if (userInfo) await getUser({ id: userInfo.id });
                socketInfo = connectSocket();
              }

              if (userInfo) {
                const config = await prepareWriteContract({
                  address: chainContract,
                  abi: JSON.parse(mainAbi),
                  chainId: currentChain.id,
                  functionName: "transferMoney",
                  args: [userInfo.walletAddress],
                  overrides: {
                    from: address,
                    value: utils.parseEther(String(form.sum)),
                    // gasLimit: BigNumber.from(100000),
                  },
                });

                const wrireRes = await writeContract(config);
                const result = await wrireRes?.wait();
                if (result) await sendDonation(userInfo, socketInfo);
              } else {
                console.log("not userInfo", userInfo);
                setIsLoading(false);
              }
            } else {
              console.log(
                "no chainContract/currentChain",
                chainContract && currentChain
              );
              setIsLoading(false);
            }
          } else {
            addNotification({
              type: "warning",
              title: intl.formatMessage({
                id: "donat_warning_message_balance_title",
              }),
              message: intl.formatMessage({
                id: "donat_warning_message_balance_description",
              }),
            });
          }
        } else {
          addNotification({
            type: "warning",
            title: intl.formatMessage({
              id: "donat_warning_message_himself_title",
            }),
            message: intl.formatMessage({
              id: "donat_warning_message_himself_description",
            }),
          });
        }
      }
    } catch (error) {
      const errInfo = error as RpcError<IError>;
      if (errInfo.code !== 4001 && errInfo?.data?.statusCode !== 500) {
        addNotification({
          type: "danger",
          title: "Error",
          message:
            errInfo.message ||
            errInfo?.data?.message ||
            "An error occurred while sending data",
        });
      }
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
