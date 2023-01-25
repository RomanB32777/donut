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
  const { color, icon, nativeCurrency, name } = blockchainInfo;
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
      <p className="name">{nativeCurrency.symbol}</p>
    </div>
  );
};

export default SelectedBlockchain;
