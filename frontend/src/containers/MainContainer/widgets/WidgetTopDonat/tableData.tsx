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
    render: (text) => text + " tEVMOS",
  },
  {
    title: "Message",
    dataIndex: "message",
    width: "40%",
  },
  {
    title: "Date and Time, UTM",
    dataIndex: "date",
    width: "25%",
  },
];

export type { ITableData };
