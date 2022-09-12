import type { ColumnsType } from "antd/es/table";

interface ITableData {
  key: string;
  name: string;
  donationToken: number;
  donationUSD: number;
  message: string;
  date: string;
}

export const tableColumns: ColumnsType<ITableData> = [
  {
    title: "Name",
    dataIndex: "name",
    width: "15%",
    align: "center",
  },
  {
    title: "Donation, Token",
    dataIndex: "donationToken",
    width: "15%",
    align: "center",
  },
  {
    title: "Donation, USD",
    dataIndex: "donationUSD",
    align: "center",
    sorter: (a, b) => a.donationUSD - b.donationUSD,
    width: "15%",
  },
  {
    title: "Message",
    dataIndex: "message",
    width: "30%",
  },
  {
    title: "Date and Time",
    dataIndex: "date",
    width: "25%",
    // defaultSortOrder: "descend",
    sorter: (a, b) => new Date(a.date).getDate() - new Date(b.date).getDate(),
  },
];

export const data: ITableData[] = [
  {
    key: "1",
    name: "John Brown",
    donationToken: 32,
    donationUSD: 32,
    message: "New York No. 1 Lake Park",
    date: new Date().toString(),
  },
  {
    key: "2",
    name: "Jim Green",
    donationToken: 42,
    donationUSD: 42,
    message:
      "London No. 1 Lake Park London No. 1 Lake Park London No. 1 Lake Park London No. 1 Lake Parkм London No. 1 Lake ParkLondon No. 1 Lake Park London No. 1 Lake Park London No. 1 Lake Park",
    date: new Date().toString(),
  },
  {
    key: "3",
    name: "Joe Black",
    donationToken: 32,
    donationUSD: 30,
    message: "Sidney No. 1 Lake Park",
    date: new Date().toString(),
  },
  {
    key: "3",
    name: "Joe Black",
    donationToken: 32,
    donationUSD: 30,
    message: "Sidney No. 1 Lake Park",
    date: new Date().toString(),
  },
  {
    key: "3",
    name: "Joe Black",
    donationToken: 32,
    donationUSD: 30,
    message: "Sidney No. 1 Lake Park",
    date: new Date().toString(),
  },
  {
    key: "3",
    name: "Joe Black",
    donationToken: 32,
    donationUSD: 30,
    message: "Sidney No. 1 Lake Park",
    date: new Date().toString(),
  },
  {
    key: "3",
    name: "Joe Black",
    donationToken: 32,
    donationUSD: 30,
    message: "Sidney No. 1 Lake Park",
    date: new Date().toString(),
  },
  {
    key: "3",
    name: "Joe Black",
    donationToken: 32,
    donationUSD: 30,
    message: "Sidney No. 1 Lake Park",
    date: new Date().toString(),
  },
  {
    key: "3",
    name: "Joe Black",
    donationToken: 32,
    donationUSD: 30,
    message: "Sidney No. 1 Lake Park",
    date: new Date().toString(),
  },
  {
    key: "3",
    name: "Joe Black",
    donationToken: 32,
    donationUSD: 30,
    message: "Sidney No. 1 Lake Park",
    date: new Date().toString(),
  },
];

export type { ITableData };
