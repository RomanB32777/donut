import { memo } from "react";
import clsx from "clsx";
import { IBlockchain } from "appTypes";
import "./styles.sass";

const SelectedBlockchain = ({
  blockchainInfo,
  modificator,
}: {
  blockchainInfo: IBlockchain;
  modificator?: string;
}) => {
  const { color, icon, name, badgeName } = blockchainInfo;
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
      <p className="name">{badgeName}</p>
    </div>
  );
};

export default memo(SelectedBlockchain);
