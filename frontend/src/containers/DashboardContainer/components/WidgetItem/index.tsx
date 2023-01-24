import { Col, Row } from "antd";
import dayjsModule from "modules/dayjsModule";

import { DateTimezoneFormatter } from "utils";
import "./styles.sass";

const WidgetItem = ({ donat }: { donat: any }) => (
  <div className="widget-item">
    <Row gutter={[32, 0]}>
      <Col span={24}>
        <div className="row">
          <Row justify="space-between" align="middle" style={{ width: "100%" }}>
            <Col xs={17} md={18}>
              <div className="header">
                <div className="name">
                  {donat.username}
                </div>
                <div className="sum">
                  {(Number(donat.sum_donation)).toFixed(2)}&nbsp; USD
                </div>
              </div>
            </Col>
            <Col xs={5} md={4}>
              <div className="time">
                {dayjsModule(DateTimezoneFormatter(donat.created_at))
                  .startOf("minutes")
                  .fromNow()}
              </div>
            </Col>
          </Row>
          <p className="message">
            {donat.donation_message}
          </p>
        </div>
      </Col>
    </Row>
  </div>
);

export default WidgetItem;
