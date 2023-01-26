import { useEffect, useState } from "react";
import { Col, Empty, Row } from "antd";
import { stringFormatTypes } from "types";

import SelectComponent from "components/SelectComponent";
import WidgetLoader from "../WidgetLoader";

import axiosClient from "modules/axiosClient";
import { useAppSelector } from "hooks/reduxHooks";
import { formatNumber, getTimePeriodQuery } from "utils";
import { filterPeriodItems, widgetApiUrl } from "consts";

const LIMIT_SUPPORTERS = 6;

const WidgetTopSup = () => {
  const { user, notifications } = useAppSelector((state) => state);

  const [loading, setLoading] = useState<boolean>(true);
  const [activeFilterItem, setActiveFilterItem] = useState(
    filterPeriodItems["7days"]
  );
  const [topSupporters, setTopSupporters] = useState<any[]>([]);

  const { id } = user;
  const { list, shouldUpdateApp } = notifications;

  const getLatestDonations = async (activeFilterItem: string) => {
    try {
      console.log("getLatestDonations");

      const timePeriod = getTimePeriodQuery(activeFilterItem);
      const { data } = await axiosClient.get(
        `${widgetApiUrl}/top-supporters/${id}?limit=${LIMIT_SUPPORTERS}&timePeriod=${timePeriod}`
      );
      data && setTopSupporters(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    id && getLatestDonations(activeFilterItem);
  }, [id, activeFilterItem]);

  useEffect(() => {
    list.length && shouldUpdateApp && getLatestDonations(activeFilterItem);
  }, [list, shouldUpdateApp]);

  return (
    <div className="widget widget-topSup">
      {loading ? (
        <WidgetLoader />
      ) : (
        <>
          <div className="header">
            <span className="widget-title">Top supporters</span>
            <div className="filter">
              <SelectComponent
                title={activeFilterItem}
                list={Object.values(filterPeriodItems)}
                selectItem={(selected) =>
                  setActiveFilterItem(selected as stringFormatTypes)
                }
                listWrapperModificator="filter-list"
              />
            </div>
          </div>

          {Boolean(topSupporters.length) ? (
            <div className="items">
              <Row gutter={[16, 16]}>
                {topSupporters.map((donat: any) => (
                  <Col span={12} key={donat.username}>
                    <div className="widget-item simple">
                      <div className="name">{donat.username}</div>
                      <div className="sum">
                        {formatNumber(donat.sum_donation)} USD
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
