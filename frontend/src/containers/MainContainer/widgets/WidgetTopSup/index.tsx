import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Col, Empty, Row } from "antd";
import { stringFormatTypes } from "types";

import { WalletContext } from "contexts/Wallet";
import SelectComponent from "components/SelectComponent";
import axiosClient from "modules/axiosClient";

import { getTimePeriodQuery } from "utils";
import { filterPeriodItems, widgetApiUrl } from "consts";
import "./styles.sass";

const LIMIT_SUPPORTERS = 6;

const WidgetTopSup = ({ usdtKoef }: { usdtKoef: number }) => {
  const user: any = useSelector((state: any) => state.user);
  const { list, shouldUpdateApp } = useSelector(
    (state: any) => state.notifications
  );
  const { walletConf } = useContext(WalletContext);

  const [loading, setLoading] = useState<boolean>(false);
  const [activeFilterItem, setActiveFilterItem] = useState(
    filterPeriodItems["7days"]
  );
  const [topSupporters, setTopSupporters] = useState<any[]>([]);

  const getLatestDonations = async (timePeriod: string) => {
    try {
      setLoading(true);
      const currBlockchain = await walletConf.getCurrentBlockchain();

      if (currBlockchain) {
        const blockchain = currBlockchain.name;
        const { data } = await axiosClient.get(
          `${widgetApiUrl}/top-supporters/${user.id}?limit=${LIMIT_SUPPORTERS}&timePeriod=${timePeriod}&blockchain=${blockchain}`
        );
        data && setTopSupporters(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timePeriod = getTimePeriodQuery(activeFilterItem);
    user.id && timePeriod && shouldUpdateApp && getLatestDonations(timePeriod);
  }, [user, activeFilterItem, list, shouldUpdateApp]);

  return (
    <div className="widget widget-topSup">
      <div className="widget_header">
        <span className="widget_header__title">Top supporters</span>
        <div className="widget_header__filter">
          <SelectComponent
            title={activeFilterItem}
            list={Object.values(filterPeriodItems)}
            selectItem={(selected) =>
              setActiveFilterItem(selected as stringFormatTypes)
            }
          />
        </div>
      </div>
      {/* {loading && <Loader size="small" />} */}
      {Boolean(topSupporters.length) ? (
        <div className="widget__items">
          <Row gutter={[16, 16]}>
            {topSupporters.map((donat: any) => (
              <Col span={12} key={donat.username}>
                <div className="widget__item">
                  <div className="widget__item_name">{donat.username}</div>
                  <div className="widget__item_sum">
                    {(+donat.sum_donation * usdtKoef).toFixed(2)} USD
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </div>
  );
};

export default WidgetTopSup;
