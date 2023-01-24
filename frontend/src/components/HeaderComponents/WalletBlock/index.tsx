import { CheckOutlined } from "@ant-design/icons";
import clsx from "clsx";
import { useContext, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { blockchainsType } from "types";

import { WalletContext } from "contexts/Wallet";
import Loader from "components/Loader";
import { CopyIcon, ShareIcon, SmallToggleListArrowIcon } from "icons";
import { useAppSelector } from "hooks/reduxHooks";
import useWindowDimensions from "hooks/useWindowDimensions";
import useOnClickOutside from "hooks/useClickOutside";

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
  const dispatch = useDispatch();
  const walletConf = useContext(WalletContext);
  const { blockchain, user } = useAppSelector((store) => store);
  const blockRef = useRef(null);
  const { isMobile } = useWindowDimensions();

  const [walletData, setWalletData] = useState<IBlockchain>(initBlockchainData);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isOpenSelect, setOpenSelect] = useState(false);

  const { username, avatar } = user;

  const copyAddress = () => copyStr(address, "Wallet address");
  const handlerPopup = () => setOpenSelect((prev) => !prev);

  const blockchainHandler =
    (selectedBlockchain: blockchainsType) => async () => {
      setLoading(true);
      const newBlockchaind = await walletConf.changeBlockchain(
        selectedBlockchain
      );
      newBlockchaind && dispatch(setSelectedBlockchain(selectedBlockchain));
      setLoading(false);
    };

  useOnClickOutside(isOpenSelect, blockRef, handlerPopup);

  useEffect(() => {
    const getWalletData = async () => {
      setLoading(true);
      const data = await walletConf.getWalletData();
      const blockchain = await walletConf.getCurrentBlockchain();
      await walletConf.getBalance(setBalance);

      if (data && blockchain) {
        setWalletData((initData) => ({
          ...initData,
          ...blockchain,
          address: data.address,
        }));
      }

      setLoading(false);
    };
    getWalletData();
  }, [blockchain]);

  const { address, nativeCurrency, icon, color, blockExplorerUrls } =
    walletData;
  const { symbol } = nativeCurrency;

  return (
    <div
      ref={blockRef}
      className={clsx("wallet-wrapper", modificator)}
      onClick={handlerPopup}
    >
      {loading ? (
        <Loader size="small" />
      ) : (
        <div
          className={clsx("wallet-block", {
            loaded: !loading,
          })}
        >
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
        <div className={clsx("popup fadeIn", popupModificator)}>
          <div className="item">
            <div className="content">
              <div className="image">
                {avatar && <img src={avatar} alt={`avatar_${username}`} />}
              </div>
              <span className="title">
                {shortStr(address, isMobile ? 2 : 8)}
              </span>
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
              {blockExplorerUrls && Boolean(blockExplorerUrls.length) && (
                <div className="share">
                  <a
                    href={`${blockExplorerUrls[0]}/address/${address}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ShareIcon />
                  </a>
                </div>
              )}
            </div>
          </div>
          {walletConf.main_contract.blockchains.map(
            ({ nativeCurrency, name, icon, color }) => (
              <div
                key={name}
                className="item"
                data-blockchain={name}
                onClick={blockchainHandler(name)}
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
