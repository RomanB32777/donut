import { FC, memo, useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { useAccount, useBalance, useNetwork, useSwitchNetwork } from "wagmi";
import { useIntl } from "react-intl";
import { CheckOutlined } from "@ant-design/icons";

import Loader from "components/Loader";
import { WalletsModal } from "components/ModalComponent/wallets-modal";
import { CopyIcon, ShareIcon, SmallToggleListArrowIcon } from "icons";
import { useAppSelector } from "hooks/reduxHooks";
import useWindowDimensions from "hooks/useWindowDimensions";
import useOnClickOutside from "hooks/useClickOutside";

import useAuth from "hooks/useAuth";
import { BlockchainNetworks, fullChainsInfo } from "utils/wallets/wagmi";
import { copyStr, formatNumber, shortStr } from "utils";
import "./styles.sass";

interface IWalletBlock {
  modificator?: string;
  isPropLoading?: boolean;
  popupModificator?: string;
  children?: React.ReactNode;
  isLogoutOnChangeAcc?: boolean;
  connectedWallet?: (walletAddress: string) => any;
}

const WalletBlock: FC<IWalletBlock> = ({
  children,
  modificator,
  isPropLoading,
  popupModificator,
  isLogoutOnChangeAcc,
  connectedWallet,
}) => {
  const intl = useIntl();
  const { address, isConnected } = useAccount();
  const { chain: currentChain } = useNetwork();
  const { isLoading, switchNetwork } = useSwitchNetwork();
  const { data: balanceData, isLoading: isBalanceLoading } = useBalance({
    address,
  });
  const { logout } = useAuth();

  const { username, avatarLink, walletAddress } = useAppSelector(
    ({ user }) => user
  );
  const blockRef = useRef(null);
  const { isMobile } = useWindowDimensions();

  const [isOpenSelect, setOpenSelect] = useState(false);
  const [isOpenWalletsModal, setIsOpenWalletsModal] = useState(false);

  const chains = Object.values(fullChainsInfo);

  const copyAddress = () => {
    address &&
      copyStr({
        str: address,
        copyObject: intl.formatMessage({ id: "copy_message_wallet" }),
      });
  };
  const handlerPopup = () => setOpenSelect((prev) => !prev);
  const openWalletsModal = () => setIsOpenWalletsModal(true);
  const closeWalletsModal = () => setIsOpenWalletsModal(false);

  const blockchainHandler = (chainId: number) => () => {
    handlerPopup();
    switchNetwork?.(chainId);
  };

  const connectedMethod = async (walletAddress: string) => {
    await connectedWallet?.(walletAddress);
    closeWalletsModal();
  };

  useOnClickOutside(isOpenSelect, blockRef, handlerPopup);

  const currentChainInfo = useMemo(() => {
    return (
      currentChain && fullChainsInfo[currentChain.network as BlockchainNetworks]
    );
  }, [currentChain]);

  useEffect(() => {
    if (!isConnected) {
      openWalletsModal();
      isOpenSelect && handlerPopup();
    }
  }, [isConnected, currentChainInfo, isOpenSelect]);

  useEffect(() => {
    if (walletAddress && walletAddress !== address) {
      logout(isLogoutOnChangeAcc);
    }
  }, [address, walletAddress]);

  return (
    <>
      <div className={clsx("wallet-wrapper", modificator)}>
        {isLoading || isPropLoading || !isConnected ? (
          <Loader size="small" />
        ) : (
          <div
            ref={blockRef}
            className={clsx("wallet-block", {
              loaded: !isLoading,
            })}
            onClick={handlerPopup}
          >
            {currentChainInfo && (
              <div className="wallet-icon">
                <img
                  src={currentChainInfo.icon}
                  alt="wallet-icon"
                  style={{ background: currentChainInfo.color }}
                />
              </div>
            )}
            {isBalanceLoading ? (
              <Loader size="small" />
            ) : (
              <p className="balance">
                {balanceData && formatNumber(balanceData.formatted, 1)}{" "}
                {balanceData?.symbol}
              </p>
            )}

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
        {isOpenSelect && (
          <div className={clsx("popup fadeIn", popupModificator)}>
            <div className="item">
              <div className="content">
                <div className="image">
                  {avatarLink && (
                    <img src={avatarLink} alt={`avatar_${username}`} />
                  )}
                </div>
                <span className="title">
                  {address && shortStr(address, isMobile ? 2 : 8)}
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
                {currentChain?.blockExplorers &&
                  Boolean(currentChain.blockExplorers.length) && (
                    <div className="share">
                      <a
                        href={`${currentChain.blockExplorers[0]}/address/${address}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <ShareIcon />
                      </a>
                    </div>
                  )}
              </div>
            </div>
            {chains.map(({ id, name, nativeCurrency, icon, color }) => (
              <div key={id} className="item" onClick={blockchainHandler(id)}>
                <div className="content">
                  <div className="image" style={{ background: color }}>
                    <img src={icon} alt={`icon_${name}`} />
                  </div>
                  <span className="title">{nativeCurrency.symbol}</span>
                </div>
                {currentChain?.name === name && (
                  <div className="icons">
                    <CheckOutlined
                      style={{
                        color: "#25EC39",
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
            {children}
          </div>
        )}
      </div>
      <WalletsModal
        open={isOpenWalletsModal}
        connectedWallet={connectedMethod}
        onCancel={closeWalletsModal}
        closable={false}
        maskClosable={false}
      />
    </>
  );
};

export default memo(WalletBlock);
