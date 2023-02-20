import type { ColumnsType } from "antd/es/table";
import { Link } from "react-router-dom";
import { userRoles } from "types";
import { DateFormatter } from "utils";
import { RoutePaths } from "routes";

interface ITableData {
  name: string;
  donationToken: number;
  donationUSD: number;
  message: string;
  date: string;
  blockchain: string;
  role?: userRoles;
}

const initTableDataItem: ITableData = {
  name: "",
  donationToken: 0,
  donationUSD: 0,
  message: "",
  date: "",
  blockchain: "",
};

const tableColumns: ColumnsType<ITableData> = [
  {
    title: "Username",
    dataIndex: "name",
    key: "name",
    width: "15%",
    align: "center",
    render: (name, { role }) => {
      if (role === "backers")
        return <Link to={`/${RoutePaths.support}/${name}`}>{name}</Link>;
      return name;
    },
  },
  {
    title: "Donation, Token",
    dataIndex: "donationToken",
    key: "donationToken",
    width: "15%",
    align: "center",
    render: (num, { blockchain }) =>
      num && blockchain ? num + ` ${blockchain}` : "-",
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
    render: (message) => message || "-",
  },
  {
    title: "Date and Time, UTM",
    dataIndex: "date",
    key: "date",
    width: "25%",
    render: (date) => DateFormatter(date),
    sorter: (a, b) =>
      Date.parse(a.date) &&
      Date.parse(b.date) &&
      new Date(a.date).getTime() - new Date(b.date).getTime(),
  },
];

export { initTableDataItem, tableColumns };
export type { ITableData };
