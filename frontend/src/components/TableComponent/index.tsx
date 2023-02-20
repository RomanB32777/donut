import React from "react";
import { Table } from "antd";
import type { TableProps } from "antd/es/table";
import Loader from "components/Loader";
import "./styles.sass";

interface ITableData<T> extends TableProps<T> {}

const TableComponent = <T extends object>({
  dataSource,
  columns,
  pagination,
  loading,
}: React.PropsWithChildren<ITableData<T>>): React.ReactElement => (
  <Table
    className="app-table"
    columns={columns}
    dataSource={dataSource}
    pagination={pagination}
    loading={{
      spinning: loading as boolean,
      indicator: <Loader size="small" />,
      className: "table-loader",
    }}
  />
);

export default TableComponent;
