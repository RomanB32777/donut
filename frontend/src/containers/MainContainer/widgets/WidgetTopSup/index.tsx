import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Col, Row } from "antd";
import SelectComponent from "../../../../components/SelectComponent";
import axiosClient from "../../../../axiosClient";
import { filterPeriodItems } from "../../../../consts";
import "./styles.sass";

const LIMIT_SUPPORTERS = 6;

const WidgetTopSup = ({ usdtKoef }: { usdtKoef: number }) => {
  const user: any = useSelector((state: any) => state.user);
  // const [activeFilterItem, setActiveFilterItem] = useState(
  //   filterPeriodItems["7days"]
  // );
  const [topSupporters, setTopSupporters] = useState<any[]>([]);

  const getLatestDonations = async () => {
    // timePeriod: string
    try {
      const { data } = await axiosClient.get(
        `/api/donation/widgets/top-supporters/${user.id}?limit=${LIMIT_SUPPORTERS}` // &timePeriod=${timePeriod}
      );
      data.supporters &&
        data.supporters.length &&
        setTopSupporters(data.supporters);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // const timePeriod = Object.keys(filterPeriodItems).find(
    //   (key: string) => filterPeriodItems[key] === activeFilterItem
    // );
    user.id && getLatestDonations();
  }, [user]); // activeFilterItem

  return (
    <div className="widget widget-topSup">
      <div className="widget_header">
        <span className="widget_header__title">Top supporters</span>
        {/* <div className="widget_header__filter">
          <SelectComponent
            title={activeFilterItem}
            list={Object.values(filterPeriodItems)}
            selectItem={(selected) => setActiveFilterItem(selected)}
          />
        </div> */}
      </div>
      {Boolean(topSupporters.length) &&
        topSupporters.map((donat: any) => (
          <div className="widget__items" key={donat.id}>
            <Row gutter={[48, 16]}>
              <Col span={12}>
                <div className="widget__item">
                  <div className="widget__item_name">{donat.username}</div>
                  <div className="widget__item_sum">
                    {(+donat.sum_donations * usdtKoef).toFixed(2)} USD
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        ))}
    </div>
  );
};

export default WidgetTopSup;
