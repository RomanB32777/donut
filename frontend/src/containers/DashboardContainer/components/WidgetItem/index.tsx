import { Col, Row } from "antd";
import dayjsModule from "modules/dayjsModule";

import { DateTimezoneFormatter } from "utils";
import "./styles.sass";

const WidgetItem = ({ donat }: { donat: any }) => (
  <div className="widget__items">
    <Row gutter={[32, 0]}>
      <Col span={24}>
        <div className="widget__item widget__item_row">
          <Row justify="space-between" align="middle" style={{ width: "100%" }}>
            <Col xs={17} md={18}>
              <div className="widget__item_header widget__item_row_header">
                <div className="widget__item_header_name name">
                  {donat.username}
                </div>
                <div className="widget__item_header_sum sum">
                  {(Number(donat.sum_donation)).toFixed(2)}&nbsp; USD
                </div>
              </div>
            </Col>
            <Col xs={5} md={4}>
              <div className="widget__item_header_time time">
                {dayjsModule(DateTimezoneFormatter(donat.created_at))
                  .startOf("minutes")
                  .fromNow()}
              </div>
            </Col>
          </Row>
          <p className="widget__item_message message">
            {donat.donation_message}
          </p>
        </div>
      </Col>
    </Row>
  </div>
);

export default WidgetItem;
