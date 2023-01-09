import { useContext, useEffect, useState } from "react";
import { Empty } from "antd";
import { stringFormatTypes } from "types";

import { WalletContext } from "contexts/Wallet";
import WidgetItem from "../WidgetItem";
import SelectComponent from "components/SelectComponent";

import { useAppSelector } from "hooks/reduxHooks";
import { getTimePeriodQuery } from "utils";
import axiosClient from "modules/axiosClient";
import { filterPeriodItems, widgetApiUrl } from "consts";
import "./styles.sass";

const LIMIT_LATEST = 6;

const WidgetLatestDonat = ({ usdtKoef }: { usdtKoef: number }) => {
  const { user, notifications } = useAppSelector((state) => state);
  const { walletConf } = useContext(WalletContext);

  const { list, shouldUpdateApp } = notifications;

  const [activeFilterItem, setActiveFilterItem] = useState(
    filterPeriodItems["7days"]
  );
  const [latestDonations, setLatestDonations] = useState<any[]>([]);

  const getLatestDonations = async (timePeriod: string) => {
    try {
      const currBlockchain = await walletConf.getCurrentBlockchain();
      if (currBlockchain) {
        const blockchain = currBlockchain.name;
        const { data } = await axiosClient.get(
          `${widgetApiUrl}/latest-donations/${user.id}?limit=${LIMIT_LATEST}&timePeriod=${timePeriod}&blockchain=${blockchain}`
        );
        data && setLatestDonations(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const timePeriod = getTimePeriodQuery(activeFilterItem);
    user.id && timePeriod && shouldUpdateApp && getLatestDonations(timePeriod);
  }, [user, activeFilterItem, list, shouldUpdateApp]);

  return (
    <div className="widget widget-latestDonat">
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
          <WidgetItem key={donat.id} donat={donat} usdtKoef={usdtKoef} />
        ))
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </div>
  );
};

export default WidgetLatestDonat;
