import { IBlockchain } from "appTypes";
import "./styles.sass";

const SelectedBlockchain = ({
  blockchainInfo,
}: {
  blockchainInfo: IBlockchain;
}) => {
  const { color, icon, nativeCurrency, name } = blockchainInfo;
  return (
    <div className="blockchain-info">
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
