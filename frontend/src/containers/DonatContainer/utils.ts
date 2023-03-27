import { useContext, useState } from "react";
import { Socket } from "socket.io-client";
import {
  RpcError,
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
} from "wagmi";
import { useIntl } from "react-intl";
import { utils } from "ethers";
import { ISocketEmitObj, ISendDonat, IUser } from "types";

import { useSocketConnection, WebSocketContext } from "contexts/Websocket";
import {
  useLazyCheckIsExistUserQuery,
  useCreateUserMutation,
} from "store/services/UserService";
import useAuth from "hooks/useAuth";
import { useActions } from "hooks/reduxHooks";
import { useCreateDonationMutation } from "store/services/DonationsService";
import { useLazyGetNotificationsQuery } from "store/services/NotificationsService";
import { BlockchainNetworks, fullChainsInfo } from "utils/wallets/wagmi";
import { addNotification, removeAuthToken } from "utils";
import { mainAbi } from "consts";
import { IError } from "appTypes";

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

  const currentChainNetwork = currentChain?.network;

  const chainContract = currentChainNetwork
    ? fullChainsInfo[currentChainNetwork as BlockchainNetworks].contractAddress
    : undefined;

  const { config } = usePrepareContractWrite({
    address: chainContract,
    abi: JSON.parse(mainAbi),
    functionName: "transferMoney",
    args: [creatorInfo.walletAddress],
    overrides: {
      from: address,
      value: utils.parseEther(String(sum)),
    },
  });

  const { writeAsync } = useContractWrite(config);

  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
        }).unwrap();
        return userDadta;
      } else setIsSuccess(false);
    } catch (error) {
      console.log(error);
      setIsSuccess(false);
    }
  };

  const sendDonation = async () => {
    try {
      let userInfo: IUser | undefined = supporterInfo;
      let socketInfo: Socket | null = socket;

      if (!userInfo.id || userInfo.roleplay === "creators") {
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
            toSendUsername: userInfo.username,
            id: donationData.id,
          };

          if (socketInfo) socketInfo.emit("newDonat", emitObj);
          else console.log("not connected user");

          await getNotifications({
            username: userInfo.username,
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
      if (address) {
        const { walletAddress } = creatorInfo;

        if (address !== walletAddress) {
          setIsLoading(true);

          if (!supporterInfo.id) {
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
            if (currentChain) {
              const res = await writeAsync?.();
              if (res) await sendDonation();
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
