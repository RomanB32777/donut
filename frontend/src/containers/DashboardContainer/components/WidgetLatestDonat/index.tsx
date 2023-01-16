import { useEffect, useState } from "react";
import { Empty } from "antd";
import { stringFormatTypes } from "types";

import WidgetItem from "../WidgetItem";
import SelectComponent from "components/SelectComponent";
import WidgetLoader from "../WidgetLoader";

import { useAppSelector } from "hooks/reduxHooks";
import { getTimePeriodQuery } from "utils";
import axiosClient from "modules/axiosClient";
import { filterPeriodItems, widgetApiUrl } from "consts";

const LIMIT_LATEST = 6;

const WidgetLatestDonat = () => {
  const { user, notifications } = useAppSelector((state) => state);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeFilterItem, setActiveFilterItem] = useState(
    filterPeriodItems["7days"]
  );
  const [latestDonations, setLatestDonations] = useState<any[]>([]);

  const { list, shouldUpdateApp } = notifications;

  const getLatestDonations = async (timePeriod: string) => {
    try {
      const { id, spam_filter } = user;
      const { data, status } = await axiosClient.get(
        `${widgetApiUrl}/latest-donations/${id}?limit=${LIMIT_LATEST}&timePeriod=${timePeriod}&spam_filter=${spam_filter}`
      );
      status === 200 && setLatestDonations(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timePeriod = getTimePeriodQuery(activeFilterItem);
    user.id && shouldUpdateApp && getLatestDonations(timePeriod);
  }, [user, activeFilterItem, list, shouldUpdateApp]);

  return (
    <div className="widget widget-latestDonat">
      {loading ? (
        <WidgetLoader />
      ) : (
        <>
          <div className="widget_header">
            <span className="widget_header__title">Recent donations</span>
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
          {Boolean(latestDonations.length) ? (
            latestDonations.map((donat: any) => (
              <WidgetItem key={donat.id} donat={donat} />
            ))
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </>
      )}
    </div>
  );
};

export default WidgetLatestDonat;
