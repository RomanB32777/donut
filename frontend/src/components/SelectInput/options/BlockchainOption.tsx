import { WalletContext } from "contexts/Wallet";
import { useContext, useMemo } from "react";
import { ISelectItem } from "..";

const BlockchainOption = ({ value, key }: ISelectItem) => {
  const walletConf = useContext(WalletContext);

  const info = useMemo(
    () =>
      walletConf.main_contract.blockchains.find(
        (b) => b.name === key || b.nativeCurrency.symbol === value
      ),
    [walletConf, key, value]
  );

  if (info) {
    const { color, icon, name, nativeCurrency } = info;
    return (
      <div className="blockchain-option">
        <div className="image" style={{ background: color }}>
          <img src={icon} alt={`icon_${name}`} />
        </div>
        <span className="title">{nativeCurrency.symbol}</span>
      </div>
    );
  }

  return null;
};

export default BlockchainOption;
