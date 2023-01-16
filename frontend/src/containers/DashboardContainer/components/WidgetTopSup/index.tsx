import { useEffect, useState } from "react";
import { Col, Empty, Row } from "antd";
import { stringFormatTypes } from "types";

import SelectComponent from "components/SelectComponent";
import WidgetLoader from "../WidgetLoader";

import axiosClient from "modules/axiosClient";
import { useAppSelector } from "hooks/reduxHooks";
import { getTimePeriodQuery } from "utils";
import { filterPeriodItems, widgetApiUrl } from "consts";

const LIMIT_SUPPORTERS = 6;

const WidgetTopSup = () => {
  const { user, notifications } = useAppSelector((state) => state);

  const [loading, setLoading] = useState<boolean>(true);
  const [activeFilterItem, setActiveFilterItem] = useState(
    filterPeriodItems["7days"]
  );
  const [topSupporters, setTopSupporters] = useState<any[]>([]);

  const { list, shouldUpdateApp } = notifications;

  const getLatestDonations = async (timePeriod: string) => {
    try {
      const { data } = await axiosClient.get(
        `${widgetApiUrl}/top-supporters/${user.id}?limit=${LIMIT_SUPPORTERS}&timePeriod=${timePeriod}`
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
    user.id && shouldUpdateApp && getLatestDonations(timePeriod);
  }, [user, list, shouldUpdateApp, activeFilterItem]);

  return (
    <div className="widget widget-topSup">
      {loading ? (
        <WidgetLoader />
      ) : (
        <>
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

          {Boolean(topSupporters.length) ? (
            <div className="widget__items">
              <Row gutter={[16, 16]}>
                {topSupporters.map((donat: any) => (
                  <Col span={12} key={donat.username}>
                    <div className="widget__item">
                      <div className="widget__item_name">{donat.username}</div>
                      <div className="widget__item_sum">
                        {(+donat.sum_donation).toFixed(2)} USD
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </>
      )}
    </div>
  );
};

export default WidgetTopSup;
