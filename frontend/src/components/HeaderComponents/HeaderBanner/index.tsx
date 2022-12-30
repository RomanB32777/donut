import { useContext, useEffect, useState } from "react";
import { WalletContext } from "../../../contexts/Wallet";
import "./styles.sass";

export const HeaderBanner = () => {
  const [currBlockchain, setCurrBlockchain] = useState<string>("");

  const { walletConf } = useContext(WalletContext);

  useEffect(() => {
    const getCurrentBlockchain = async () => {
      const currBlockchain = await walletConf.getCurrentBlockchain();
      currBlockchain && setCurrBlockchain(currBlockchain.chainName);
    };

    getCurrentBlockchain();
  }, [walletConf]);

  if (!currBlockchain) return null;

  return (
    <div className="navbar-banner">
      Currently working on {currBlockchain} network only
    </div>
  );
};
