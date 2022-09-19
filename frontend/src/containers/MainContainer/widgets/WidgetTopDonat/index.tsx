import { useEffect, useState } from "react";
import SelectComponent from "../../../../components/SelectComponent";
import TableComponent from "../../../../components/TableComponent";
import { filterItems } from "../../consts";
import { ITableData, tableColums } from "./tableData";
import "./styles.sass";
import { useSelector } from "react-redux";
import axiosClient from "../../../../axiosClient";
import { DateFormatter, DateTimezoneFormatter } from "../../../../utils";

const LIMIT_DONATS = 6;

const WidgetTopDonat = () => {
  const user: any = useSelector((state: any) => state.user);
  const [tableData, setTableData] = useState<ITableData[]>([]);
  const [activeFilterItem, setActiveFilterItem] = useState(filterItems["7days"]);

  const getTopDonations = async (timePeriod: string) => {
    const { data } = await axiosClient.get(
      `/api/donation/widgets/top-donations/${user.id}?limit=${LIMIT_DONATS}&timePeriod=${timePeriod}`
    );
    if (data.donations && data.donations.length) {
      const forTableData: ITableData[] = data.donations.map((donat: any) => ({
        key: donat.id,
        name: donat.username,
        donationToken: donat.sum_donation + ", EVMOS",
        message: donat.donation_message,
        date: DateFormatter(DateTimezoneFormatter(donat.donation_date))
      }));
      setTableData(forTableData)
    }
  };

  useEffect(() => {
    const timePeriod = Object.keys(filterItems).find(
      (key: string) => filterItems[key] === activeFilterItem
    );
    user.id && timePeriod && getTopDonations(timePeriod);
  }, [user, activeFilterItem]);

  return (
    <div className="widget widget-topDonat">
      <div className="widget_header">
        <span className="widget_header__title">Top donations</span>
        <div className="widget_header__filter">
          <SelectComponent
            title={activeFilterItem}
            list={Object.values(filterItems)}
            selectItem={(selected) => setActiveFilterItem(selected)}
          />
        </div>
      </div>
      <div className="widget__items">
        <TableComponent
          dataSource={tableData}
          columns={tableColums}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default WidgetTopDonat;
