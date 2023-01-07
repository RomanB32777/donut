import { CheckOutlined } from "@ant-design/icons";
import clsx from "clsx";
import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { useAppSelector } from "hooks/reduxHooks";
import { WalletContext } from "contexts/Wallet";

import Loader from "components/Loader";
import { CopyIcon, ShareIcon, SmallToggleListArrowIcon } from "icons";
import { setSelectedBlockchain } from "store/types/Wallet";
import { copyStr, shortStr } from "utils";
import { initBlockchainData } from "consts";
import { IBlockchain } from "appTypes";
import "./styles.sass";

const WalletBlock = ({
  modificator,
  popupModificator,
}: {
  modificator?: string;
  popupModificator?: string;
}) => {
  const { walletConf } = useContext(WalletContext);
  const dispatch = useDispatch();
  const { blockchain, user } = useAppSelector((store) => store);

  const [walletData, setWalletData] = useState<IBlockchain>(initBlockchainData);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isOpenSelect, setOpenSelect] = useState(false);

  const copyAddress = () => copyStr(address);

  const blockchainHandler = async ({
    currentTarget,
  }: React.MouseEvent<HTMLDivElement>) => {
    const selectedBlockchain = currentTarget.dataset?.blockchain;
    if (selectedBlockchain) {
      setLoading(true);
      await walletConf.changeBlockchain(selectedBlockchain);
      dispatch(setSelectedBlockchain(selectedBlockchain));
      setLoading(false);
    }
  };

  useEffect(() => {
    const getWalletData = async () => {
      setLoading(true);
      const data = await walletConf.getBlockchainData();
      const blockchain = await walletConf.getCurrentBlockchain();
      await walletConf.getBalance(setBalance);

      if (data && blockchain) {
        setWalletData((initData) => ({
          ...initData,
          address: data.address,
          nativeCurrency: {
            ...initData.nativeCurrency,
            symbol: blockchain.nativeCurrency.symbol,
          },
          icon: blockchain.icon,
          color: blockchain?.color,
          scannerLink: blockchain.scannerLink,
        }));
      }

      setLoading(false);
    };
    getWalletData();
  }, [blockchain]);

  const { address, nativeCurrency, icon, color, scannerLink } = walletData;
  const { symbol } = nativeCurrency;

  return (
    <div
      className={clsx("wallet-wrapper", {
        [modificator as string]: modificator,
        loaded: !loading,
      })}
      onClick={() => setOpenSelect((prev) => !prev)}
    >
      {loading ? (
        <Loader size="small" />
      ) : (
        <div className="wallet-block">
          <div className="wallet-icon">
            <img src={icon} alt="wallet-icon" style={{ background: color }} />
          </div>
          <p className="balance">
            {balance.toFixed(1)} {symbol}
          </p>
          {address && (
            <div className="address">
              <p>{shortStr(address, 3)}</p>
            </div>
          )}
          <div
            className={clsx("icon", {
              rotated: isOpenSelect,
            })}
          >
            <SmallToggleListArrowIcon />
          </div>
        </div>
      )}
      {Boolean(isOpenSelect) && (
        <div
          className={clsx("popup", {
            [popupModificator as string]: popupModificator,
          })}
        >
          <div className="item">
            <div className="content">
              <div className="image">
                <img src={user.avatar} alt={`avatar_${user.username}`} />
              </div>
              <span className="title">{shortStr(address, 3)}</span>
            </div>
            <div
              className="icons"
              onClick={(e: React.MouseEvent<HTMLDivElement>) =>
                e.stopPropagation()
              }
            >
              <div className="copy" onClick={copyAddress}>
                <CopyIcon />
              </div>
              <div className="share">
                <a
                  href={scannerLink + address}
                  target="_blank"
                  rel="noreferrer"
                >
                  <ShareIcon />
                </a>
              </div>
            </div>
          </div>
          {walletConf.blockchains.map(
            ({ nativeCurrency, name, icon, color }) => (
              <div
                key={name}
                className="item"
                data-blockchain={name}
                onClick={blockchainHandler}
              >
                <div className="content">
                  <div className="image" style={{ background: color }}>
                    <img src={icon} alt={`icon_${name}`} />
                  </div>
                  <span className="title">{nativeCurrency.symbol}</span>
                </div>

                {symbol === nativeCurrency.symbol && (
                  <div className="icons">
                    <CheckOutlined
                      style={{
                        color: "#25EC39",
                      }}
                    />
                  </div>
                )}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default WalletBlock;
