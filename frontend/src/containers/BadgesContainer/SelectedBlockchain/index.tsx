import { memo } from "react";
import clsx from "clsx";
import { FullBlockchainInfo } from "utils/wallets/wagmi";
import "./styles.sass";

const SelectedBlockchain = ({
  blockchainInfo,
  modificator,
}: {
  blockchainInfo: FullBlockchainInfo;
  modificator?: string;
}) => {
  const { color, icon, name } = blockchainInfo;
  return (
    <div className={clsx("blockchain-info", modificator)}>
      <div
        className="icon"
        style={{
          background: color,
        }}
      >
        <div className="image">
          <img src={icon} alt={`icon_${name}`} />
        </div>
      </div>
      <p className="name">{name}</p>
    </div>
  );
};

export default memo(SelectedBlockchain);
