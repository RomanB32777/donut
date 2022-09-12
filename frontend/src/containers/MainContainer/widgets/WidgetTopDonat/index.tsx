import { useState } from "react";
import SelectComponent from "../../../../components/SelectComponent";
import TableComponent from "../../../../components/TableComponent";
import { filterItems } from "../../consts";
import "./styles.sass";
import { ITableData, tableColums } from "./tableData";

const data: ITableData[] = [
  {
    key: "1",
    name: "John Brown",
    donationToken: 32,
    message: "New York No. 1 Lake Park",
    date: new Date().toString(),
  },
  {
    key: "2",
    name: "Jim Green",
    donationToken: 42,
    message:
      "London No. 1 Lake P Park London No. 1 Lake Park",
    date: new Date().toString(),
  },
  {
    key: "3",
    name: "Joe Black",
    donationToken: 32,
    message: "Sidney No. 1 Lake Park",
    date: new Date().toString(),
  },
];

const WidgetTopDonat = () => {
  const [activeFilterItem, setActiveFilterItem] = useState(filterItems[1]);

  return (
    <div className="widget widget-topDonat">
      <div className="widget_header">
        <span className="widget_header__title">Top donations</span>
        <div className="widget_header__filter">
          <SelectComponent
            title={activeFilterItem}
            list={filterItems}
            selectItem={(selected) => setActiveFilterItem(selected)}
          />
        </div>
      </div>
      <div className="widget__items">
        <TableComponent
          dataSource={data}
          columns={tableColums}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default WidgetTopDonat;
