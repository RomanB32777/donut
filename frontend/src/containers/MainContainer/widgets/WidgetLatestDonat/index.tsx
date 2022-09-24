import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Col, Row } from "antd";
import moment from "moment";
import SelectComponent from "../../../../components/SelectComponent";
import { filterPeriodItems, getTimePeriodQuery } from "../../../../consts";
import axiosClient from "../../../../axiosClient";
import { DateTimezoneFormatter } from "../../../../utils";
import "./styles.sass";

const LIMIT_LATEST = 6;

const WidgetLatestDonat = ({ usdtKoef }: { usdtKoef: number }) => {
  const user: any = useSelector((state: any) => state.user);
  const [activeFilterItem, setActiveFilterItem] = useState(
    filterPeriodItems["7days"]
  );
  const [latestDonations, setLatestDonations] = useState<any[]>([]);

  const getLatestDonations = async (timePeriod: string) => {
    try {
      const { data } = await axiosClient.get(
        `/api/donation/widgets/latest-donations/${user.id}?limit=${LIMIT_LATEST}&timePeriod=${timePeriod}`
      );
      data && setLatestDonations(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const timePeriod = getTimePeriodQuery(activeFilterItem);
    user.id && timePeriod && getLatestDonations(timePeriod);
  }, [user, activeFilterItem]);

  return (
    <div className="widget widget-latestDonat">
      <div className="widget_header">
        <span className="widget_header__title">Recent donations</span>
        <div className="widget_header__filter">
          <SelectComponent
            title={activeFilterItem}
            list={Object.values(filterPeriodItems)}
            selectItem={(selected) => setActiveFilterItem(selected)}
          />
        </div>
      </div>
      {Boolean(latestDonations.length) &&
        latestDonations.map((donat: any) => (
          <div className="widget__items" key={donat.id}>
            <Row gutter={[32, 0]}>
              <Col span={24}>
                <div className="widget__item">
                  <Row justify="space-between" style={{ width: "100%" }}>
                    <Col span={16}>
                      <div className="widget__item_header">
                        <div className="widget__item_header_name">
                          {donat.username}
                        </div>
                        <div className="widget__item_header_sum">
                          {(+donat.sum_donation * usdtKoef).toFixed(2)} USD
                        </div>
                      </div>
                    </Col>
                    <Col span={6}>
                      <div className="widget__item_header_time">
                        {moment(DateTimezoneFormatter(donat.donation_date))
                          .startOf("minutes")
                          .fromNow()}
                      </div>
                    </Col>
                  </Row>
                  <p className="widget__item_message">
                    {donat.donation_message}
                  </p>
                </div>
              </Col>
            </Row>
          </div>
        ))}
    </div>
  );
};

export default WidgetLatestDonat;
