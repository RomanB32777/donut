import React from "react";
import { Type } from "typescript";
import { Table } from "antd";
import type { ColumnsType, TablePaginationConfig, TableProps } from "antd/es/table";
import "./styles.sass";

interface ITableData<T> extends TableProps<T> {}
// colums: ColumnsType<T>;
// dataSource: T[];

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
