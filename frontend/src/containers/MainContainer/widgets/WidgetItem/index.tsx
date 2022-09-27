import { Col, Row } from "antd";
import moment from "moment";
import { DateTimezoneFormatter } from "../../../../utils";
import "./styles.sass";

const WidgetItem = ({ donat, usdtKoef }: { donat: any; usdtKoef: number }) => (
  <div className="widget__items">
    <Row gutter={[32, 0]}>
      <Col span={24}>
        <div className="widget__item widget__item_row">
          <Row justify="space-between" style={{ width: "100%" }}>
            <Col lg={16} xs={18}>
              <div className="widget__item_header widget__item_row_header">
                <div className="widget__item_header_name name">
                  {donat.username}
                </div>
                <div className="widget__item_header_sum sum">
                  {(
                    Number(donat.sum_donation) * usdtKoef
                  ).toFixed(2)}{" "}
                  USD
                </div>
              </div>
            </Col>
            <Col lg={6} xs={4}>
              <div className="widget__item_header_time time">
                {moment(
                  DateTimezoneFormatter(donat.donation_date)
                )
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
