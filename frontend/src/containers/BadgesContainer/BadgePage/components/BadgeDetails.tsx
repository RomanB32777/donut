import { memo, useContext, useMemo } from "react";
import { Col, Row } from "antd";
import { IBadgeInfo } from "types";

import { WalletContext } from "contexts/Wallet";
import SelectedBlockchain from "containers/BadgesContainer/SelectedBlockchain";
import Loader from "components/Loader";

const BadgeDetails = ({
  badgeInfo,
  isLoading,
}: {
  badgeInfo: IBadgeInfo;
  isLoading: boolean;
}) => {
  const walletConf = useContext(WalletContext);

  const { title, description, is_creator, assigned, blockchain } = badgeInfo;

  const selectedBlockchainInfo = useMemo(
    () =>
      walletConf.main_contract.blockchains.find((b) => b.name === blockchain),
    [walletConf, blockchain]
  );

  if (isLoading) return <Loader size="big" />;

  return (
    <div className="details">
      <p className="information-title">Badge information</p>
      <div className="content">
        <div className="row">
          <Row justify="space-between">
            <Col md={5} xs={7}>
              <p className="title">Name</p>
            </Col>
            <Col md={18} xs={16}>
              <p className="value">{title}</p>
            </Col>
          </Row>
        </div>
        <div className="row">
          <Row justify="space-between">
            <Col md={5} xs={7}>
              <p className="title">Description</p>
            </Col>
            <Col md={18} xs={16}>
              <p className="value">{description}</p>
            </Col>
          </Row>
        </div>
        <div className="row">
          <Row justify="space-between">
            <Col md={5} xs={7}>
              <p className="title">{is_creator ? "Assigned" : "Quantity"}</p>
            </Col>
            <Col md={18} xs={16}>
              <p className="value">{assigned}</p>
            </Col>
          </Row>
        </div>
        <div className="row">
          <Row justify="space-between" align="middle">
            <Col md={5} xs={7}>
              <p className="title">Blockchain</p>
            </Col>
            <Col md={18} xs={16}>
              <div className="value">
                {selectedBlockchainInfo && (
                  <SelectedBlockchain
                    blockchainInfo={selectedBlockchainInfo}
                    modificator="absolute"
                  />
                )}
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default memo(BadgeDetails);
