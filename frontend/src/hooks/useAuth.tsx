import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useAccount,
  useDisconnect,
  useNetwork,
  useSignMessage,
  useSwitchNetwork,
} from "wagmi";
import Web3Token from "web3-token";
import { userRoles } from "types";

import { useActions } from "hooks/reduxHooks";
import {
  useLazyGetUserQuery,
  useLazyCheckIsExistUserRoleQuery,
} from "store/services/UserService";
import { useLazyVerifyTokenQuery } from "store/services/AuthService";
import {
  getAuthToken,
  getWebToken,
  removeAuthToken,
  removeWebToken,
  scrollToPosition,
  setWebToken,
} from "utils";
import { fullChainsInfo } from "utils/wallets/wagmi";
import { RoutePaths } from "consts";
import { AppContext } from "contexts/AppContext";

const useAuth = () => {
  const navigate = useNavigate();
  const { logoutUser } = useActions();
  const { activeAuthModal, setActiveAuthModal } = useContext(AppContext);
  const { isConnected, address, connector } = useAccount();
  const { chain: currentChain } = useNetwork();
  const { disconnect } = useDisconnect();
  const { switchNetwork } = useSwitchNetwork();
  const [getUser] = useLazyGetUserQuery();
  const { signMessageAsync } = useSignMessage();
  const [verifyToken] = useLazyVerifyTokenQuery();
  const [checkIsExistUser] = useLazyCheckIsExistUserRoleQuery();

  const [registrationRoleUser, setRegistrationRoleUser] =
    useState<userRoles | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const closeAuthModal = () => setActiveAuthModal(null);

  const openRegistrationModal = (role: userRoles) => {
    setActiveAuthModal("sign");
    setRegistrationRoleUser(role);
  };

  const chooseRole = (role: userRoles) => {
    if (role === "backers") {
      setActiveAuthModal("wallets");
    } else {
      openRegistrationModal("creators");
    }
  };

  const selectAuthWallet = async (address: string, propChain?: any) => {
    const isExist = await checkWallet(address, propChain);
    if (isExist) {
      scrollToPosition();
      navigate(`/${RoutePaths.admin}/${RoutePaths.dashboard}`);
      setActiveAuthModal(null);
    } else {
      openRegistrationModal("backers");
    }
  };

  // const selectWallet = (cb: (address: string) => void) => (address: string) =>
  //   cb(address);

  const checkWallet = async (propAddress?: string, propChain?: any) => {
    try {
      const walletAddress = address ?? propAddress;
      if (walletAddress) {
        if (currentChain ?? propChain) {
          const { data: isExistBacker } = await checkIsExistUser({
            field: walletAddress,
            role: "backers",
          });

          if (isExistBacker) {
            await checkWebToken();
            await getUser({
              walletAddress: walletAddress,
              roleplay: "backers",
            });
            return true;
            // not registered user - to registration page
          } else {
            removeWebToken();
            logoutUser();
            return false;
          }
        } else {
          const { maticmum, matic } = fullChainsInfo;
          const defaultChain =
            process.env.NODE_ENV === "development" ? maticmum : matic;

          switchNetwork?.(defaultChain.id);
          return false;
        }
      } else {
        console.log("not connected");
        return false;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkAuthToken = async (isRedirect = false) => {
    try {
      const token = getAuthToken();
      if (token) {
        const { data } = await verifyToken(token);
        if (data) {
          const { id } = data;
          const { isSuccess, isError } = await getUser({ id });
          if (isError) {
            removeAuthToken();
            navigate(RoutePaths.main);
          }
          return isSuccess;
        }
      }
      //  else if (isRedirect) {
      //   return navigate(RoutePaths.main);
      // }
    } catch (error) {
      console.log(error);
    }
  };

  const checkWebToken = async () => {
    try {
      const localToken = getWebToken();
      if (!localToken) {
        const token = await Web3Token.sign(
          async (msg: any) => await signMessageAsync({ message: msg }),
          process.env.REACT_APP_ACCESS_TOKEN_EXPIRATION || "7d"
        );
        setWebToken(token);
      }
    } catch (error) {
      console.log("checkWebToken error", error);
      throw new Error("token error");
    }
  };

  const checkAuth = async (redirectToMainPage = true) => {
    try {
      setIsLoading(true);
      const isCreator = await checkAuthToken();
      if (!isCreator) {
        const isBacker = await checkWallet();
        if (!isBacker) {
          if (redirectToMainPage) {
            setIsLoading(false);
            navigate(RoutePaths.main);
          } else return false;
        }
        return isBacker;
      }
      return isCreator;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    removeWebToken();
    removeAuthToken();
    logoutUser();
    isConnected && disconnect();
    return navigate(RoutePaths.main);
  };

  return {
    activeAuthModal,
    registrationRoleUser,
    isAuthLoading: isLoading,
    chooseRole,
    closeAuthModal,
    selectAuthWallet,
    setActiveAuthModal,
    setRegistrationRoleUser,
    checkAuthToken,
    checkWebToken,
    checkWallet,
    checkAuth,
    logout,
  };
};

export default useAuth;
