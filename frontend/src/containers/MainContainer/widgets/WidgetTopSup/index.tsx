import { useState } from "react";
import { Col, Row } from "antd";
import SelectComponent from "../../../../components/SelectComponent";
import { filterItems } from "../../consts";
import "./styles.sass";

const WidgetTopSup = () => {
  const [activeFilterItem, setActiveFilterItem] = useState(filterItems[1]);

  return (
    <div className="widget widget-topSup">
      <div className="widget_header">
        <span className="widget_header__title">Top supporters</span>
        <div className="widget_header__filter">
          <SelectComponent
            title={activeFilterItem}
            list={filterItems}
            selectItem={(selected) => setActiveFilterItem(selected)}
          />
        </div>
      </div>
      <div className="widget__items">
        <Row gutter={[48, 16]}>
          <Col span={12}>
            <div className="widget__item">
              <div className="widget__item_name">CryptoDonutz</div>
              <div className="widget__item_sum">100 USD</div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default WidgetTopSup;
