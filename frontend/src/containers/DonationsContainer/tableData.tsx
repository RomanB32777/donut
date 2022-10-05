import type { ColumnsType } from "antd/es/table";
import { Link } from "react-router-dom";
import { roleUser } from "../../types";
import { DateFormatter, DateTimezoneFormatter } from "../../utils";

interface ITableData {
  name: string;
  donationToken: number;
  donationUSD: number;
  message: string;
  date: string;
  blockchain: string;
  role?: roleUser;
}

export const initTableDataItem: ITableData = {
  name: "",
  donationToken: 0,
  donationUSD: 0,
  message: "",
  date: "",
  blockchain: "",
};

export const tableColumns: ColumnsType<ITableData> = [
  {
    title: "Username",
    dataIndex: "name",
    key: "name",
    width: "15%",
    align: "center",
    render: (name, { role }) => {
      if (role === "backers")
        return <Link to={`/support/${name}`}>{name}</Link>;
      return name;
    },
  },
  {
    title: "Donation, Token",
    dataIndex: "donationToken",
    key: "donationToken",
    width: "15%",
    align: "center",
    render: (text, { blockchain }) => text + ` ${blockchain}`,
  },
  {
    title: "Donation, USD",
    dataIndex: "donationUSD",
    key: "donationUSD",
    align: "center",
    render: (text) => text + " USD",
    sorter: (a, b) => a.donationUSD - b.donationUSD,
    width: "15%",
  },
  {
    title: "Message",
    dataIndex: "message",
    key: "message",
    width: "30%",
    // responsive: ['lg'],
    // ellipsis: true,
  },
  {
    title: "Date and Time, UTM",
    dataIndex: "date",
    key: "date",
    width: "25%",
    render: (text) =>
      Date.parse(text) ? DateFormatter(DateTimezoneFormatter(text)) : "-",
    sorter: (a, b) =>
      Date.parse(a.date) &&
      Date.parse(b.date) &&
      new Date(a.date).getTime() - new Date(b.date).getTime(),
  },
];

export type { ITableData };
