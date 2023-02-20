import FileSaver from "file-saver";
import { utils, write } from "xlsx";
import { initTableDataItem, ITableData, tableColumns } from "./tableData";

const exportToExcel = (tableData: ITableData[]) => {
  const heading = Object.keys(initTableDataItem).reduce((acc, curr) => {
    const fromTableColumns = tableColumns.find((c) => c.key === curr);
    return {
      ...acc,
      [curr]: fromTableColumns ? fromTableColumns.title : curr,
    };
  }, {});

  const excelData: ITableData[] = tableData.map((d) =>
    Object.keys(d)
      .filter((d) => !["role", "key"].includes(d))
      .reduce(
        (acc, key) => ({ ...acc, [key]: d[key as keyof ITableData] }),
        initTableDataItem
      )
  );

  const wsColsData = Object.keys(heading)
    .filter((col) => col !== "role")
    .map((col) => ({
      wch: Math.max(
        ...excelData.map((d) => String(d[col as keyof ITableData]).length + 2)
      ),
    }));

  const wsColsHeader = Object.keys(heading)
    .filter((col) => col !== "role")
    .map((col) => ({ wch: col.length + 2 }));

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
    origin: -1, //ok
  });
  const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  const excelBuffer = write(wb, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });
  FileSaver.saveAs(data, "donations.xlsx");
};

export { exportToExcel };
