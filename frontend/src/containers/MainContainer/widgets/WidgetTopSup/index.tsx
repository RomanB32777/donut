import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Col, Empty, Row } from "antd";
import Loader from "../../../../components/Loader";
import SelectComponent from "../../../../components/SelectComponent";
import axiosClient from "../../../../axiosClient";
import { filterPeriodItems, getTimePeriodQuery } from "../../../../consts";
import "./styles.sass";

const LIMIT_SUPPORTERS = 6;

const WidgetTopSup = ({ usdtKoef }: { usdtKoef: number }) => {
  const user: any = useSelector((state: any) => state.user);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeFilterItem, setActiveFilterItem] = useState(
    filterPeriodItems["7days"]
  );
  const [topSupporters, setTopSupporters] = useState<any[]>([]);

  const getLatestDonations = async (timePeriod: string) => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get(
        `/api/donation/widgets/top-supporters/${user.id}?limit=${LIMIT_SUPPORTERS}&timePeriod=${timePeriod}`
      );
      data && setTopSupporters(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timePeriod = getTimePeriodQuery(activeFilterItem);
    user.id && timePeriod && getLatestDonations(timePeriod);
  }, [user, activeFilterItem]);

  return (
    <div className="widget widget-topSup">
      <div className="widget_header">
        <span className="widget_header__title">Top supporters</span>
        <div className="widget_header__filter">
          <SelectComponent
            title={activeFilterItem}
            list={Object.values(filterPeriodItems)}
            selectItem={(selected) => setActiveFilterItem(selected)}
          />
        </div>
      </div>
      {/* {loading && <Loader size="small" />} */}
      {Boolean(topSupporters.length) ? (
        topSupporters.map((donat: any) => (
          <div className="widget__items" key={donat.username}>
            <Row gutter={[48, 16]}>
              <Col span={12}>
                <div className="widget__item">
                  <div className="widget__item_name">{donat.username}</div>
                  <div className="widget__item_sum">
                    {(+donat.sum_donation * usdtKoef).toFixed(2)} USD
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        ))
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </div>
  );
};

export default WidgetTopSup;
