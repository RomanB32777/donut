import { useEffect, useState } from "react";
import { Empty } from "antd";
import { stringFormatTypes } from "types";
import axiosClient from "modules/axiosClient";

import SelectComponent from "components/SelectComponent";
import TableComponent from "components/TableComponent";
import useWindowDimensions from "hooks/useWindowDimensions";
import WidgetItem from "../WidgetItem";

import { useAppSelector } from "hooks/reduxHooks";
import { ITableData, tableColums } from "./tableData";
import { getTimePeriodQuery } from "utils";
import { filterPeriodItems, widgetApiUrl } from "consts";

const LIMIT_DONATS = 6;

const WidgetTopDonat = () => {
  const { isTablet } = useWindowDimensions();
  const { user, notifications } = useAppSelector((state) => state);

  const { id, spam_filter } = user;
  const { list, shouldUpdateApp } = notifications;

  const [topDonations, setTopDonations] = useState<ITableData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeFilterItem, setActiveFilterItem] = useState(
    filterPeriodItems["7days"]
  );

  const getTopDonations = async (timePeriod: string) => {
    try {
      setLoading(true);
      const { data, status } = await axiosClient.get(
        `${widgetApiUrl}/top-donations/${id}?limit=${LIMIT_DONATS}&timePeriod=${timePeriod}&spam_filter=${spam_filter}`
      );
      if (status === 200) {
        const forTableData: ITableData[] = data.map((donat: any) => ({
          ...donat,
          key: donat.id,
        }));
        setTopDonations(forTableData);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timePeriod = getTimePeriodQuery(activeFilterItem);
    if (id && timePeriod && shouldUpdateApp)
      getTopDonations(timePeriod);
  }, [id, activeFilterItem, list, shouldUpdateApp]);

  return (
    <div className="widget widget-topDonat">
      <div className="header">
        <span className="widget-title">Top donations</span>
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
      <div className="items">
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
            return <WidgetItem key={donat.key} donat={donat} />;
          })}
        {isTablet && !Boolean(topDonations.length) && (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </div>
    </div>
  );
};

export default WidgetTopDonat;
