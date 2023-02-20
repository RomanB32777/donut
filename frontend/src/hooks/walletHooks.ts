import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useActions } from "./reduxHooks";
import { useLogoutUser } from "./userHooks";
import {
  useLazyCheckIsExistUserQuery,
  useLazyGetUserQuery,
} from "store/services/UserService";
import { WalletContext } from "contexts/Wallet";
import { RoutePaths } from "routes";

const useWallet = () => {
  const logout = useLogoutUser();
  const navigate = useNavigate();
  const [getUser] = useLazyGetUserQuery();
  const [checkIsExistUser] = useLazyCheckIsExistUserQuery();
  const walletConf = useContext(WalletContext);
  const { setLoading, setWallet } = useActions();

  const [walletLoading, setWalletLoading] = useState(false);

  const checkWallet = async (isRedirect?: boolean) => {
    try {
      setWalletLoading(true);

      const walletData = await walletConf.getWalletData();

      if (walletData) {
        const { address } = walletData;
        const currentBlockchain = await walletConf.getCurrentBlockchain();
        if (currentBlockchain) {
          // set blockchain and check user registr
          setWallet(currentBlockchain.name);
          const { data: isExistUser } = await checkIsExistUser(address);

          if (isExistUser) {
            getUser(address);
            return true;
            // not registered user - to registration page
          } else if (isRedirect) return navigate(`/${RoutePaths.register}`);
        } else {
          const newBlockchaind = await walletConf.changeBlockchain("polygon");
          if (newBlockchaind) setWallet("polygon");
          else if (isRedirect) navigate(RoutePaths.main);
        }
      } else {
        if (isRedirect) logout();
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setWalletLoading(false);
    }
  };

  return { checkWallet, loading: walletLoading };
};

export { useWallet };
