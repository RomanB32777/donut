import type { ColumnsType } from "antd/es/table";
import { FormattedMessage } from "react-intl";
import { DateFormatter } from "utils";

interface ITableData {
  key: string;
  username: string;
  message: string;
  date: string;
  blockchain: string;
}

const tableColums: ColumnsType<ITableData> = [
  {
    title: <FormattedMessage id="table_col_username" />,
    dataIndex: "username",
    width: "15%",
    align: "center",
  },
  {
    title: <FormattedMessage id="table_col_donation_token" />,
    dataIndex: "sum",
    width: "20%",
    align: "center",
    render: (text, { blockchain }) => text + ` ${blockchain}`,
  },
  {
    title: <FormattedMessage id="table_col_message" />,
    dataIndex: "message",
    width: "40%",
  },
  {
    title: <FormattedMessage id="table_col_date" />,
    dataIndex: "createdAt",
    width: "25%",
    render: (date) => DateFormatter(date),
  },
];

export type { ITableData };
export { tableColums };
