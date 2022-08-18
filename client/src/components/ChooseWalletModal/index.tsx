import { useDispatch, useSelector } from "react-redux";
import getTronWallet, {
  getMetamaskWallet,
  metamaskWalletIsIntall,
  tronWalletIsIntall,
} from "../../functions/getTronWallet";
import MetaMaskFoxBig from "../../assets/MetaMask_Fox_big.png";
import TronlinkBig from "../../assets/tronlink_big.png";
import {
  openAuthMetamaskModal,
  openAuthTronModal,
  openRegistrationModal,
  closeModal,
} from "../../store/types/Modal";
import { FormattedMessage } from "react-intl";
import { setMainWallet } from "../../store/types/Wallet";
import { useNavigate } from "react-router";
import routes from "../../routes";
import { checkIsExistUser } from "../../utils";
import { tryToGetUser } from "../../store/types/User";

import "./styles.sass";

const ChooseWalletModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const data = useSelector((state: any) => state.personInfo).main_info;
  // const user = useSelector((state: any) => state.user);

  const registrationWalletClick = async (walletType: string) => {
    if (walletType === "metamask") {
      if (metamaskWalletIsIntall()) {
        const walletToken = await getMetamaskWallet();
        if (walletToken) {
          const walletData = {
            wallet: "metamask",
            token: walletToken,
          };
          dispatch(setMainWallet(walletData));
          const isExist = await checkIsExistUser(walletToken);
          if (!isExist) {
            dispatch(openRegistrationModal());
          } else {
            dispatch(tryToGetUser(walletToken));
            navigate(routes.profile);
            dispatch(closeModal());
          }
        }
      } else {
        dispatch(openAuthMetamaskModal());
      }
    } else {
      if (tronWalletIsIntall()) {
        const walletToken = getTronWallet();
        if (walletToken) {
          const walletData = {
            wallet: "tron",
            token: walletToken,
          };
          dispatch(setMainWallet(walletData));
          const isExist = await checkIsExistUser(walletToken);
          if (!isExist) {
            dispatch(openRegistrationModal());
          } else {
            dispatch(tryToGetUser(walletToken));
            navigate(routes.profile);
            dispatch(closeModal());
          }
        }
      } else {
        dispatch(openAuthTronModal());
      }
    }
  };

  return (
    <div className="donat-popup__registration_wallets">
      <div className="donat-popup__registration_wallets-item">
        <div className="donat-popup__registration_wallets-img">
          <img src={MetaMaskFoxBig} alt="" />
        </div>
        <div
          className="donat-popup__registration_wallets-btn"
          onClick={() => registrationWalletClick("metamask")}
        >
          <FormattedMessage id="mainpage_main_button_metamask" />
        </div>
        <div className="donat-popup__registration_wallets-descr">
          Working on Polygon Mumbai Testnet
        </div>
      </div>
      <div className="donat-popup__registration_wallets-item">
        <div className="donat-popup__registration_wallets-img">
          <img src={TronlinkBig} alt="" />
        </div>
        <div
          className="donat-popup__registration_wallets-btn"
          onClick={() => registrationWalletClick("tronlink")}
        >
          <FormattedMessage id="mainpage_main_button_tronlink" />
        </div>
        <div className="donat-popup__registration_wallets-descr">
          Working on Tron Nile Testnet
        </div>
      </div>
    </div>
  );
};

export default ChooseWalletModal;
