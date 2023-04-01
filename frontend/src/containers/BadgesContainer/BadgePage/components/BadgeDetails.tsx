import { memo } from "react";
import { Col, Row } from "antd";
import { FormattedMessage } from "react-intl";

import SelectedBlockchain from "containers/BadgesContainer/SelectedBlockchain";
import Loader from "components/Loader";
import { fullChainsInfo } from "utils/wallets/wagmi";
import { IBadgePage } from "appTypes";

const BadgeDetails = ({
  badgeInfo,
  isLoading,
}: {
  badgeInfo: IBadgePage;
  isLoading: boolean;
}) => {
  const { title, description, isCreator, assigned, blockchain } = badgeInfo;

  const selectedBlockchainInfo = Object.values(fullChainsInfo).find(
    (ch) => ch.name === blockchain
  );

  if (isLoading) return <Loader size="big" />;

  return (
    <div className="details">
      <p className="information-title">
        <FormattedMessage id="badge_information_title" />
      </p>
      <div className="content">
        <div className="row">
          <Row justify="space-between">
            <Col md={5} xs={7}>
              <p className="title">
                <FormattedMessage id="badge_information_name" />
              </p>
            </Col>
            <Col md={18} xs={16}>
              <p className="value">{title}</p>
            </Col>
          </Row>
        </div>
        <div className="row">
          <Row justify="space-between">
            <Col md={5} xs={7}>
              <p className="title">
                <FormattedMessage id="badge_information_description" />
              </p>
            </Col>
            <Col md={18} xs={16}>
              <p className="value">{description}</p>
            </Col>
          </Row>
        </div>
        <div className="row">
          <Row justify="space-between">
            <Col md={5} xs={7}>
              <p className="title">
                {isCreator ? (
                  <FormattedMessage id="badge_information_assigned" />
                ) : (
                  <FormattedMessage id="badge_information_quantity" />
                )}
              </p>
            </Col>
            <Col md={18} xs={16}>
              <p className="value">{assigned}</p>
            </Col>
          </Row>
        </div>
        <div className="row">
          <Row justify="space-between" align="middle">
            <Col md={5} xs={7}>
              <p className="title">
                <FormattedMessage id="badge_information_blockchain" />
              </p>
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
