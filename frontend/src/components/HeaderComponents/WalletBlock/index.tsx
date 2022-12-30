import clsx from "clsx";
import { useContext, useEffect, useState } from "react";
import { WalletContext } from "../../../contexts/Wallet";
import { copyStr, shortStr } from "../../../utils";
import Loader from "../../Loader";
import "./styles.sass";

interface IWalletBlockData {
  address: string;
  currency: string;
}

const WalletBlock = () => {
  const { walletConf } = useContext(WalletContext);

  const [walletData, setWalletData] = useState<IWalletBlockData>({
    address: "",
    currency: "",
  });
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getWalletData = async () => {
      setLoading(true);
      const data = await walletConf.getBlockchainData();
      const blockchain = await walletConf.getCurrentBlockchain();
      await walletConf.getBalance(setBalance);

      if (data && blockchain)
        setWalletData({
          address: data.address,
          currency: blockchain.nativeCurrency.symbol,
        });

      setLoading(false);
    };
    getWalletData();
  }, []);

  const { address, currency } = walletData;

  return (
    <div className={clsx("wallet-block", { loaded: !loading })}>
      {loading ? (
        <Loader size="small" />
      ) : (
        <>
          <div className="icon">
            <img src={walletConf.icon} alt="wallet-icon" />
          </div>
          <p className="balance">
            {balance.toFixed(1)} {currency}
          </p>
          {address && (
            <div
              className="address"
              onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                event.stopPropagation();
                copyStr(address, "address");
              }}
            >
              <p>{shortStr(address, 3)}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WalletBlock;
