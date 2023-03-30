import { useEffect, useState } from "react";
import { Col, Row } from "antd";
import { Buffer } from "buffer";
import { useConnect, useAccount, useSwitchNetwork } from "wagmi";
import { FormattedMessage } from "react-intl";
import clsx from "clsx";

import ModalComponent, { IModalComponent } from "components/ModalComponent";
import { fullChainsInfo, walletNames, walletsInfo } from "utils/wallets/wagmi";
import { addErrorNotification, removeWebToken } from "utils";
import useAuth from "hooks/useAuth";
import { useAppSelector } from "hooks/reduxHooks";
import "./styles.sass";

Buffer.from("anything", "base64");
window.Buffer = window.Buffer || require("buffer").Buffer;

interface IWalletsModal extends IModalComponent {
  connectedWallet?: (address: string) => any;
}

export const WalletsModal: React.FC<IWalletsModal> = ({
  connectedWallet,
  ...props
}) => {
  const { id, roleplay } = useAppSelector(({ user }) => user);
  const { address } = useAccount();
  const { connectors, connect, isSuccess, error } = useConnect();
  const { switchNetwork } = useSwitchNetwork();
  const { checkWallet } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const defaultChain = fullChainsInfo["matic"] ?? fullChainsInfo["maticmum"];

  const switchWallet = async (address: string) => {
    try {
      setIsLoading(true);
      if (!id || roleplay === "backers") {
        removeWebToken();
        await checkWallet();
      }
      connectedWallet?.(address);
    } catch (error) {
      console.log("switchWallet", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const errorHandler = async () => {
      if (error) {
        if (error.name === "ConnectorAlreadyConnectedError") {
          if (address) {
            await switchWallet(address);
            switchNetwork?.(defaultChain?.id);
          }
        } else if (error.name !== "UserRejectedRequestError") {
          addErrorNotification({ message: error.message });
        }
      }
    };

    errorHandler();
  }, [error, address]);

  useEffect(() => {
    if (isSuccess && address) {
      switchWallet(address);
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
            {connectors.map((connection) => {
              const walletName = connection.name as walletNames;
              const { name, image } = walletsInfo[walletName];
              return (
                <Col key={name}>
                  <div
                    className={clsx("wallet", { disabled: isLoading })}
                    onClick={() =>
                      connect({
                        connector: connection,
                        chainId: defaultChain?.id,
                      })
                    }
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
