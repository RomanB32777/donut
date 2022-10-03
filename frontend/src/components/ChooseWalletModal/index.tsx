import { useDispatch } from "react-redux";
import {
  getMetamaskData,
  metamaskWalletIsIntall,
} from "../../functions/getWalletData";
import MetaMaskFoxBig from "../../assets/MetaMask_Fox_big.png";
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
