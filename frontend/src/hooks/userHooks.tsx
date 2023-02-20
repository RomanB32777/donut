import { useNavigate } from "react-router-dom";
import { RoutePaths } from "routes";
import { storageWalletKey } from "consts";
import { useActions } from "hooks/reduxHooks";

const useLogoutUser = () => {
  const navigate = useNavigate();
  const { logoutUser, setWallet } = useActions();

  const logout = () => {
    localStorage.removeItem(storageWalletKey);
    logoutUser();
    setWallet(null);
    navigate(RoutePaths.main);
  };

  return logout;
};

export { useLogoutUser };
