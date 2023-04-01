import { useEffect, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";

import EmptyComponent from "components/EmptyComponent";
import WidgetItem from "../WidgetItem";
import WidgetLoader from "../WidgetLoader";
import FilterSelect from "../FilterSelect";

import { useAppSelector } from "hooks/reduxHooks";
import { useGetWidgetDonationsQuery } from "store/services/DonationsService";
import { getTimePeriodQuery } from "utils";
import { filterPeriodItems } from "consts";

const LIMIT_LATEST = 6;

const WidgetLatestDonat = () => {
  const { id, creator } = useAppSelector(({ user }) => user);
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
      userId: id,
      dataType: "latest-donations",
      query: {
        limit: LIMIT_LATEST,
        timePeriod,
        spamFilter: creator?.spamFilter,
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
            <span className="widget-title">
              <FormattedMessage id="dashboard_widgets_recent" />
            </span>
            <FilterSelect
              selectedItem={activeFilterItem}
              selectItem={setActiveFilterItem}
            />
          </div>
          {latestDonations && Boolean(latestDonations.length) ? (
            <div className="items">
              {latestDonations.map((donat) => (
                <WidgetItem key={donat.id} donat={donat} />
              ))}
            </div>
          ) : (
            <EmptyComponent />
          )}
        </>
      )}
    </div>
  );
};

export default WidgetLatestDonat;
