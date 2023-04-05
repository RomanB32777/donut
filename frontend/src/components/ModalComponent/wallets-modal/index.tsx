import { useMemo, useState } from "react";
import { Col, Row } from "antd";
import { Buffer } from "buffer";
import { useConnect, RpcError, useDisconnect, useAccount } from "wagmi";
import { FormattedMessage } from "react-intl";
import clsx from "clsx";

import ModalComponent, { IModalComponent } from "components/ModalComponent";
import { fullChainsInfo, walletNames, walletsInfo } from "utils/wallets/wagmi";
import { addErrorNotification, removeWebToken } from "utils";
import "./styles.sass";

Buffer.from("anything", "base64");
window.Buffer = window.Buffer || require("buffer").Buffer;

interface IWalletsModal extends IModalComponent {
  // TODO - флаги как костыли тут
  isRegistration?: boolean;
  isSettings?: boolean;
  connectedWallet?: (address: string, chain?: any) => any;
}

export const WalletsModal: React.FC<IWalletsModal> = ({
  width,
  isSettings,
  isRegistration,
  connectedWallet,
  ...props
}) => {
  const { address } = useAccount();
  const { connectors, connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const [isLoading, setIsLoading] = useState(false);

  const defaultChain = fullChainsInfo["matic"] ?? fullChainsInfo["maticmum"];

  const switchWalletHandler =
    (...args: Parameters<typeof connectAsync>) =>
    async () => {
      const [connectArgs] = args;
      try {
        setIsLoading(true);
        if (!isRegistration) {
          await disconnectAsync();
          removeWebToken();
        }
        const { account, chain } = await connectAsync(connectArgs);
        await connectedWallet?.(account, chain);
      } catch (error) {
        const errInfo = error as RpcError;

        if (errInfo.name === "ConnectorAlreadyConnectedError") {
          if (address) {
            await connectedWallet?.(address);
            //   switchNetwork?.(defaultChain?.id);
          }
        } else if (
          errInfo.name !== "UserRejectedRequestError" &&
          errInfo.code !== 4001
        ) {
          addErrorNotification({ message: errInfo.message });
        }
      } finally {
        setIsLoading(false);
      }
    };

  const wallets = useMemo(() => {
    if (isSettings)
      return connectors.filter(
        (connector) => (connector.id as walletNames) === "metaMask"
      );

    return connectors;
  }, [connectors, isSettings]);

  return (
    <ModalComponent {...props} width={width || 700}>
      <div className="walletsModal">
        <h1 className="modalTitle">
          <FormattedMessage id="wallets_connect_title" />
        </h1>
        <div className="wallets">
          <Row justify="space-around">
            {wallets.map((connection) => {
              const walletName = connection.id as walletNames;
              const { name, image } = walletsInfo[walletName];
              return (
                <Col key={name}>
                  <div
                    className={clsx("wallet", { disabled: isLoading })}
                    onClick={switchWalletHandler({
                      connector: connection,
                      chainId: defaultChain?.id,
                    })}
                  >
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
