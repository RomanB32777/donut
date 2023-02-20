import { useEffect, useMemo, useState } from "react";
import { Col, Empty, Row } from "antd";
import { stringFormatTypes } from "types";

import SelectComponent from "components/SelectComponent";
import WidgetLoader from "../WidgetLoader";

import { useAppSelector } from "hooks/reduxHooks";
import { useGetWidgetDonationsQuery } from "store/services/DonationsService";
import { formatNumber, getTimePeriodQuery } from "utils";
import { filterPeriodItems } from "consts";

const LIMIT_SUPPORTERS = 6;

const WidgetTopSup = () => {
  const { id } = useAppSelector(({ user }) => user);
  const { list, shouldUpdateApp } = useAppSelector(
    ({ notifications }) => notifications
  );

  const [activeFilterItem, setActiveFilterItem] = useState(
    filterPeriodItems["7days"]
  );

  const timePeriod = useMemo(
    () => getTimePeriodQuery(activeFilterItem),
    [activeFilterItem]
  );

  const {
    data: topSupporters,
    isLoading,
    refetch,
  } = useGetWidgetDonationsQuery(
    {
      userID: id,
      data_type: "top-supporters",
      query: {
        limit: LIMIT_SUPPORTERS,
        timePeriod,
      },
    },
    {
      skip: !id,
    }
  );

  useEffect(() => {
    list.length && shouldUpdateApp && refetch();
  }, [list, shouldUpdateApp]);

  return (
    <div className="widget widget-topSup">
      {isLoading ? (
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

          {topSupporters && Boolean(topSupporters.length) ? (
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
