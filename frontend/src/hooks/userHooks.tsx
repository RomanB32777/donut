import { useNavigate } from "react-router-dom";
import { RoutePaths } from "routes";
import { storageToken, storageWalletKey } from "consts";
import { useActions } from "hooks/reduxHooks";

const useLogoutUser = () => {
  const navigate = useNavigate();
  const { logoutUser, setWallet } = useActions();

  const logout = () => {
    localStorage.removeItem(storageWalletKey);
    localStorage.removeItem(storageToken);
    logoutUser();
    setWallet(null);
    return navigate(RoutePaths.main);
  };

  return logout;
};

export { useLogoutUser };
