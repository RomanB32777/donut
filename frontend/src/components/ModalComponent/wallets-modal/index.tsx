import { Col, Row } from "antd";
import { Buffer } from "buffer";
import { useConnect, useAccount, useSwitchNetwork } from "wagmi";
import { FormattedMessage } from "react-intl";

import ModalComponent, { IModalComponent } from "components/ModalComponent";
import { fullChainsInfo, walletNames, walletsInfo } from "utils/wallets/wagmi";
import { useEffect } from "react";
import { addErrorNotification } from "utils";

Buffer.from("anything", "base64");
window.Buffer = window.Buffer || require("buffer").Buffer;

interface IWalletsModal extends IModalComponent {
  connectedWallet?: (address: string) => any;
}

export const WalletsModal: React.FC<IWalletsModal> = ({
  connectedWallet,
  ...props
}) => {
  const { address } = useAccount();
  const { connectors, connect, isSuccess, error } = useConnect();
  const { switchNetwork } = useSwitchNetwork();

  const defaultChain = fullChainsInfo["matic"] ?? fullChainsInfo["maticmum"];

  useEffect(() => {
    if (error) {
      if (error.name === "ConnectorAlreadyConnectedError") {
        address && connectedWallet?.(address);
        switchNetwork?.(defaultChain?.id);
      } else if (error.name !== "UserRejectedRequestError") {
        addErrorNotification({ message: error.message });
      }
    }
  }, [error, address]);

  useEffect(() => {
    if (isSuccess && address) {
      connectedWallet?.(address);
    }
  }, [isSuccess, address]);

  return (
    <ModalComponent {...props}>
      <div className="walletsModal">
        <h1 className="modalTitle">
          <FormattedMessage id="wallets_connect_title" />
        </h1>
        <div className="wallets">
          <Row justify="space-around">
            {connectors
              // .filter((x) => x.ready && x.id !== connector?.id)
              .map((connection) => {
                const walletName = connection.name as walletNames;
                const { name, image } = walletsInfo[walletName];
                return (
                  <Col key={name}>
                    <div
                      className="wallet"
                      onClick={() =>
                        connect({
                          connector: connection,
                          chainId: defaultChain?.id,
                        })
                      }
                    >
                      {/* {isLoading &&
                          wallet.id === pendingConnector?.id &&
                          " (connecting)"} */}
                      <div className="walletImageWrapper">
                        <div className="walletImage">
                          <img src={image} alt={name} />
                        </div>
                      </div>
                      <p className="walletName">{name}</p>
                    </div>
                  </Col>
                );
              })}
          </Row>
        </div>
      </div>
    </ModalComponent>
  );
};
