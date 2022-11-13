import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Empty } from "antd";
import WidgetItem from "../WidgetItem";
import SelectComponent from "../../../../components/SelectComponent";
import { currBlockchain, getTimePeriodQuery } from "../../../../utils";
import { filterPeriodItems } from "../../../../utils/dateMethods/consts";
import axiosClient from "../../../../axiosClient";
import { widgetApiUrl } from "../../../../consts";
import { stringFormatTypes } from "../../../../utils/dateMethods/types";
import "./styles.sass";

const LIMIT_LATEST = 6;

const WidgetLatestDonat = ({ usdtKoef }: { usdtKoef: number }) => {
  const user: any = useSelector((state: any) => state.user);
  const notifications = useSelector((state: any) => state.notifications);

  const [activeFilterItem, setActiveFilterItem] = useState(
    filterPeriodItems["7days"]
  );
  const [latestDonations, setLatestDonations] = useState<any[]>([]);

  const getLatestDonations = async (timePeriod: string) => {
    try {
      const blockchain = currBlockchain?.nativeCurrency.symbol;
      const { data } = await axiosClient.get(
        `${widgetApiUrl}/latest-donations/${user.id}?limit=${LIMIT_LATEST}&timePeriod=${timePeriod}&blockchain=${blockchain}`
      );
      data && setLatestDonations(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const timePeriod = getTimePeriodQuery(activeFilterItem);
    user.id && timePeriod && getLatestDonations(timePeriod);
  }, [user, activeFilterItem, notifications]);

  return (
    <div className="widget widget-latestDonat">
      <div className="widget_header">
        <span className="widget_header__title">Recent donations</span>
        <div className="widget_header__filter">
          <SelectComponent
            title={activeFilterItem}
            list={Object.values(filterPeriodItems)}
            selectItem={(selected) => setActiveFilterItem(selected as stringFormatTypes)}
          />
        </div>
      </div>
      {Boolean(latestDonations.length) ? (
        latestDonations.map((donat: any) => (
          <WidgetItem key={donat.id} donat={donat} usdtKoef={usdtKoef} />
        ))
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </div>
  );
};

export default WidgetLatestDonat;
