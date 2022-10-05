import type { ColumnsType } from "antd/es/table";
import { DateFormatter, DateTimezoneFormatter } from "../../../../utils";

interface ITableData {
  key: string;
  name: string;
  donationToken: number;
  message: string;
  date: string;
  blockchain: string;
}

export const tableColums: ColumnsType<ITableData> = [
  {
    title: "Name",
    dataIndex: "username",
    width: "15%",
    align: "center",
  },
  {
    title: "Donation, Token",
    dataIndex: "sum_donation",
    width: "20%",
    align: "center",
    render: (text, { blockchain }) => text + ` ${blockchain}`,
  },
  {
    title: "Message",
    dataIndex: "donation_message",
    width: "40%",
  },
  {
    title: "Date and Time, UTM",
    dataIndex: "donation_date",
    width: "25%",
    render: (date) => DateFormatter(DateTimezoneFormatter(date)),
  },
];

export type { ITableData };
