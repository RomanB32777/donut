import FileSaver from "file-saver";
import { utils, write } from "xlsx";
import { initTableDataItem, ITableData, tableColumns } from "./tableData";

const exportToExcel = (tableData: ITableData[]) => {
  const { role, key, ...initTableData } = initTableDataItem;

  const heading = Object.keys(initTableData).reduce((acc, curr) => {
    const fromTableColumns = tableColumns.find((c) => c.key === curr);
    return {
      ...acc,
      [curr]: fromTableColumns ? fromTableColumns.key : curr,
    };
  }, initTableData);

  const excelData = tableData.map((d) =>
    Object.keys(d)
      .filter((d) => !["key", "role"].includes(d))
      .reduce(
        (acc, key) => ({ ...acc, [key]: d[key as keyof ITableData] }),
        initTableData
      )
  );

  const wsColsData = Object.keys(heading).map((col) => ({
    wch: Math.max(
      ...excelData.map((d) => String(d[col as keyof typeof heading]).length + 2)
    ),
  }));

  const wsColsHeader = Object.keys(heading).map((col) => ({
    wch: col.length + 2,
  }));

  const wscols = wsColsData.map(({ wch }, key) =>
    wch >= wsColsHeader[key].wch ? { wch } : { wch: wsColsHeader[key].wch }
  );

  const ws = utils.json_to_sheet([heading], {
    header: tableColumns.map(({ key }) => key) as string[],
    skipHeader: true,
    // origin: 0, //ok
  });
  ws["!cols"] = wscols;
  utils.sheet_add_json(ws, excelData, {
    header: tableColumns.map(({ key }) => key) as string[],
    skipHeader: true,
    origin: -1, // ok
  });
  const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  const excelBuffer = write(wb, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });
  FileSaver.saveAs(data, "donations.xlsx");
};

export { exportToExcel };
