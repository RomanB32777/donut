import { useState } from "react";
import { Col, Row } from "antd";
import SelectComponent from "../../../../components/SelectComponent";
import { filterItems } from "../../consts";
import "./styles.sass";

const WidgetLatestDonat = () => {
  const [activeFilterItem, setActiveFilterItem] = useState(filterItems[1]);

  return (
    <div className="widget widget-latestDonat">
      <div className="widget_header">
        <span className="widget_header__title">Latest donations</span>
        <div className="widget_header__filter">
          <SelectComponent
            title={activeFilterItem}
            list={filterItems}
            selectItem={(selected) => setActiveFilterItem(selected)}
          />
        </div>
      </div>
      <div className="widget__items">
        <Row gutter={[32, 0]}>
          <Col span={24}>
            <div className="widget__item">
              <Row justify="space-between" style={{ width: "100%" }}>
                <Col span={16}>
                  <div className="widget__item_header">
                    <div className="widget__item_name">CryptoDonutz</div>
                    <div className="widget__item_sum">100 USD</div>
                  </div>
                </Col>
                <Col span={6}>30 minutes ago</Col>
              </Row>
              <p className="widget__item_message">
                {/* Nice stream bro, keep it going */}
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Suscipit eveniet nesciunt quidem dolore cumque, mollitia omnis
                deserunt eum odio ut. Id doloribus ex quae, harum fugit minima
                accusamus laudantium voluptates.
              </p>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default WidgetLatestDonat;
