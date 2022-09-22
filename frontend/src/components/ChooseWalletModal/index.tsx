import { useDispatch } from "react-redux";
import getTronWallet, {
  getMetamaskData,
  metamaskWalletIsIntall,
  tronWalletIsIntall,
} from "../../functions/getTronWallet";
import MetaMaskFoxBig from "../../assets/MetaMask_Fox_big.png";
import {
  openAuthTronModal,
  openRegistrationModal,
  closeModal,
} from "../../store/types/Modal";
import { FormattedMessage } from "react-intl";
import { setMainWallet } from "../../store/types/Wallet";
import { useNavigate } from "react-router";
import { checkIsExistUser, addInstallWalletNotification } from "../../utils";
import { tryToGetUser } from "../../store/types/User";

import "./styles.sass";

const ChooseWalletModal = ({ withoutLogin }: { withoutLogin?: boolean }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const registrationWalletClick = async (walletType: string) => {
    if (walletType === "metamask") {
      if (metamaskWalletIsIntall()) {
        const walletData = await getMetamaskData();
        
        if (walletData?.address) {
          const walletObj = {
            wallet: "metamask",
            token: walletData.address,
          };
          dispatch(setMainWallet(walletObj));
          !withoutLogin &&
            localStorage.setItem("main_wallet", JSON.stringify(walletObj));
          const isExist = await checkIsExistUser(walletData.address);
          if (!isExist) {
            !withoutLogin && navigate("/register");
          } else {
            dispatch(tryToGetUser(walletData.address));
            if (!withoutLogin) {
              navigate("/");
            }
          }
        }
      } else {
        addInstallWalletNotification(
          "Metamask",
          "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
        );
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
          !withoutLogin &&
            localStorage.setItem("main_wallet", JSON.stringify(walletData));
          const isExist = await checkIsExistUser(walletToken);
          if (!isExist) {
            !withoutLogin && dispatch(openRegistrationModal());
          } else {
            dispatch(tryToGetUser(walletToken));
            if (!withoutLogin) {
              navigate("/");
              dispatch(closeModal());
            }
          }
        }
      } else {
        dispatch(openAuthTronModal());
      }
    }
  };

  return (
    <div className="donat-popup">
      <p className="donat-popup__main-title">Choose the wallet</p>
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
            Working on tEVMOS Testnet
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseWalletModal;
