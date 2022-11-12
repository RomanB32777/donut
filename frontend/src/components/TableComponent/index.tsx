import React from "react";
import { Table } from "antd";
import type { TableProps } from "antd/es/table";
import "./styles.sass";

interface ITableData<T> extends TableProps<T> {}

const TableComponent = <T extends object>({
  dataSource,
  columns,
  pagination,
  loading
}: React.PropsWithChildren<ITableData<T>>): React.ReactElement => {
  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      pagination={pagination}
      loading={loading}
    />
  );
};

export default TableComponent;
