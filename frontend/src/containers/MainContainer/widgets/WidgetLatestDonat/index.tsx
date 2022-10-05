import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Empty } from "antd";
import WidgetItem from "../WidgetItem";
import SelectComponent from "../../../../components/SelectComponent";
import { currBlockchain, filterPeriodItems, getTimePeriodQuery } from "../../../../consts";
import axiosClient from "../../../../axiosClient";
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
      const { data } = await axiosClient.get(
        `/api/donation/widgets/latest-donations/${user.id}?limit=${LIMIT_LATEST}&timePeriod=${timePeriod}&blockchain=${currBlockchain?.nativeCurrency.symbol}`
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
            selectItem={(selected) => setActiveFilterItem(selected)}
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
