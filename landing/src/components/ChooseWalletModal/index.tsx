import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router";
import { wallets } from "../../consts";
import { addInstallWalletNotification } from "../../utils";

import "./styles.sass";

const ChooseBlockchainsModal = () => {
  const navigate = useNavigate();

  const registrationWalletClick = async (name: string) => {
    const { installLink, isInstallMethod } = wallets[name];
    isInstallMethod()
      ? navigate(`/blockchains/${name}`)
      : addInstallWalletNotification(name, installLink);
  };

  return (
    <div className="donat-popup">
      <p className="donat-popup__main-title">Choose the wallet</p>
      <div className="donat-popup__registration_wallets">
        {Object.keys(wallets).map((name) => {
          const { img, blockchains } = wallets[name];
          return (
            <div className="donat-popup__registration_wallets-item" key={name}>
              <div className="donat-popup__registration_wallets-img">
                <img src={img} alt={name + "_icon"} />
              </div>
              <div
                className="donat-popup__registration_wallets-btn"
                onClick={() => registrationWalletClick(name)}
              >
                <FormattedMessage
                  id={`mainpage_main_button_${name.toLowerCase()}`}
                />
              </div>
              <div className="donat-popup__registration_wallets-descr">
                Working on {blockchains.map((b) => b.name).join(", ")}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChooseBlockchainsModal;
