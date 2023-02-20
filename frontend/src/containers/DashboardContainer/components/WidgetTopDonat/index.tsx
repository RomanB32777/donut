import { useEffect, useMemo, useState } from "react";
import { createSelector } from "@reduxjs/toolkit";
import { Empty } from "antd";
import { stringFormatTypes } from "types";

import SelectComponent from "components/SelectComponent";
import TableComponent from "components/TableComponent";
import useWindowDimensions from "hooks/useWindowDimensions";
import WidgetItem from "../WidgetItem";

import { useAppSelector } from "hooks/reduxHooks";
import { useGetWidgetDonationsQuery } from "store/services/DonationsService";
import { ITableData, tableColums } from "./tableData";
import { formatNumber, getTimePeriodQuery } from "utils";
import { filterPeriodItems } from "consts";

const LIMIT_DONATS = 6;

const WidgetTopDonat = () => {
  const { isTablet } = useWindowDimensions();
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

  const selectDonationsData = useMemo(
    () =>
      createSelector(
        (res: any) => res.data,
        (data) => {
          const forTableData: ITableData[] = data?.map((donat: any) => ({
            ...donat,
            sum_donation: formatNumber(donat.sum_donation),
            key: donat.id,
          }));

          return forTableData ?? [];
        }
      ),
    []
  );

  const { topDonations, isLoading, refetch } = useGetWidgetDonationsQuery(
    {
      userID: id,
      data_type: "latest-donations",
      query: {
        limit: LIMIT_DONATS,
        timePeriod,
        spam_filter,
      },
    },
    {
      skip: !id,
      selectFromResult: (result) => ({
        ...result,
        topDonations: selectDonationsData(result),
      }),
    }
  );

  useEffect(() => {
    list.length && shouldUpdateApp && refetch();
  }, [list, shouldUpdateApp]);

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
            loading={isLoading}
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
