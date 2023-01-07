import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Empty } from "antd";
import { stringFormatTypes } from "types";
import axiosClient from "modules/axiosClient";
import { WalletContext } from "contexts/Wallet";

import SelectComponent from "components/SelectComponent";
import TableComponent from "components/TableComponent";
import useWindowDimensions from "hooks/useWindowDimensions";
import WidgetItem from "../WidgetItem";

import { ITableData, tableColums } from "./tableData";
import { getTimePeriodQuery } from "utils";
import { filterPeriodItems, widgetApiUrl } from "consts";
import "./styles.sass";

const LIMIT_DONATS = 6;

const WidgetTopDonat = ({ usdtKoef }: { usdtKoef: number }) => {
  const { isTablet } = useWindowDimensions();
  const user: any = useSelector((state: any) => state.user);
  const { list, shouldUpdateApp } = useSelector(
    (state: any) => state.notifications
  );

  const { walletConf } = useContext(WalletContext);

  const [topDonations, setTopDonations] = useState<ITableData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeFilterItem, setActiveFilterItem] = useState(
    filterPeriodItems["7days"]
  );

  const getTopDonations = async (timePeriod: string) => {
    try {
      setLoading(true);
      const currBlockchain = await walletConf.getCurrentBlockchain();

      if (currBlockchain) {
        const blockchain = currBlockchain.name;
        const { data } = await axiosClient.get(
          `${widgetApiUrl}/top-donations/${user.id}?limit=${LIMIT_DONATS}&timePeriod=${timePeriod}&blockchain=${blockchain}`
        );
        if (data) {
          const forTableData: ITableData[] = data.map((donat: any) => ({
            key: donat.id,
            ...donat,
          }));
          setTopDonations(forTableData);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timePeriod = getTimePeriodQuery(activeFilterItem);
    user.id && timePeriod && shouldUpdateApp && getTopDonations(timePeriod);
  }, [user, activeFilterItem, list, shouldUpdateApp]);

  return (
    <div className="widget widget-topDonat">
      <div className="widget_header">
        <span className="widget_header__title">Top donations</span>
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
      <div className="widget__items">
        {!isTablet && (
          <TableComponent
            dataSource={topDonations}
            columns={tableColums}
            loading={loading}
            pagination={false}
          />
        )}
        {isTablet &&
          Boolean(topDonations.length) &&
          topDonations.map((donat: any) => {
            return (
              <WidgetItem key={donat.key} donat={donat} usdtKoef={usdtKoef} />
            );
          })}
        {isTablet && !Boolean(topDonations.length) && (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </div>
    </div>
  );
};

export default WidgetTopDonat;
