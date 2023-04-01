import { fullChainsInfo } from "utils/wallets/wagmi";
import { ISelectItem } from "..";

// const BlockchainOption = ({ value, key }: ISelectItem<BlockchainNetworks>) => {
const BlockchainOption = ({ value: chainSymbol, key }: ISelectItem<string>) => {
  const info = Object.values(fullChainsInfo).find(
    ({ nativeCurrency }) => nativeCurrency.symbol === chainSymbol
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
