import type { ColumnsType } from "antd/es/table";

interface ITableData {
  key: string;
  name: string;
  donationToken: number;
  message: string;
  date: string;
}

export const tableColums: ColumnsType<ITableData> = [
  {
    title: "Name",
    dataIndex: "name",
    width: "15%",
    align: "center",
  },
  {
    title: "Donation, Token",
    dataIndex: "donationToken",
    width: "20%",
    align: "center",
    sorter: (a, b) => a.donationToken - b.donationToken,
  },
  {
    title: "Message",
    dataIndex: "message",
    width: "40%",
  },
  {
    title: "Date and Time",
    dataIndex: "date",
    width: "25%",
    sorter: (a, b) => new Date(a.date).getDate() - new Date(b.date).getDate(),
  },
];

export type { ITableData };
