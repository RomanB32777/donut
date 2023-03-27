import { useEffect, useMemo, useState } from "react";
import { Col, Row } from "antd";
import { FormattedMessage } from "react-intl";

import EmptyComponent from "components/EmptyComponent";
import WidgetLoader from "../WidgetLoader";
import FilterSelect from "../FilterSelect";

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
      userId: id,
      dataType: "top-supporters",
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
            <span className="widget-title">
              <FormattedMessage id="dashboard_widgets_supporters" />
            </span>
            <FilterSelect
              selectedItem={activeFilterItem}
              selectItem={setActiveFilterItem}
            />
          </div>

          {topSupporters && Boolean(topSupporters.length) ? (
            <div className="items">
              <Row gutter={[16, 16]}>
                {topSupporters.map((donat: any) => (
                  <Col span={12} key={donat.username}>
                    <div className="widget-item simple">
                      <div className="name">{donat.username}</div>
                      <div className="sum">{formatNumber(donat.sum)} USD</div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          ) : (
            <EmptyComponent />
          )}
        </>
      )}
    </div>
  );
};

export default WidgetTopSup;
