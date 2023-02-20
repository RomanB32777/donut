import { useEffect, useMemo, useState } from "react";
import { Empty } from "antd";
import { stringFormatTypes } from "types";

import WidgetItem from "../WidgetItem";
import SelectComponent from "components/SelectComponent";
import WidgetLoader from "../WidgetLoader";

import { useAppSelector } from "hooks/reduxHooks";
import { useGetWidgetDonationsQuery } from "store/services/DonationsService";
import { getTimePeriodQuery } from "utils";
import { filterPeriodItems } from "consts";

const LIMIT_LATEST = 6;

const WidgetLatestDonat = () => {
  const { id, spam_filter } = useAppSelector(({ user }) => user);
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
    data: latestDonations,
    isLoading,
    refetch,
  } = useGetWidgetDonationsQuery(
    {
      userID: id,
      data_type: "latest-donations",
      query: {
        limit: LIMIT_LATEST,
        timePeriod,
        spam_filter,
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
    <div className="widget widget-latestDonat">
      {isLoading ? (
        <WidgetLoader />
      ) : (
        <>
          <div className="header">
            <span className="widget-title">Recent donations</span>
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
          {latestDonations && Boolean(latestDonations.length) ? (
            <div className="items">
              {latestDonations.map((donat) => (
                <WidgetItem key={donat.id} donat={donat} />
              ))}
            </div>
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </>
      )}
    </div>
  );
};

export default WidgetLatestDonat;
