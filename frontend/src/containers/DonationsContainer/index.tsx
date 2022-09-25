import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Checkbox, Col, Row } from "antd";
import FileSaver from "file-saver";
import { utils, write } from "xlsx";
import { SearchOutlined } from "@ant-design/icons";
import PageTitle from "../../commonComponents/PageTitle";
import FormInput from "../../components/FormInput";
import DatesPicker from "../../components/DatesPicker";
import SelectInput from "../../components/SelectInput";
import TableComponent from "../../components/TableComponent";
import BaseButton from "../../commonComponents/BaseButton";
import { CalendarIcon, DownloadIcon } from "../../icons/icons";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { initTableDataItem, ITableData, tableColumns } from "./tableData";
import { getUsdKoef } from "../../utils";
import axiosClient from "../../axiosClient";
import { filterPeriodItems, getTimePeriodQuery } from "../../consts";
import "./styles.sass";

interface IQueryForm {
  timePeriod: string;
  searchStr?: string;
  groupByName?: boolean;
  startDate?: string;
  endDate?: string;
}

const LIMIT_DONATS = 15;

const DonationsContainer = () => {
  const user = useSelector((state: any) => state.user);
  const [visibleDatesPicker, setVisibleDatesPicker] = useState(false);
  const [queryForm, setQueryForm] = useState<IQueryForm>({
    timePeriod: filterPeriodItems["7days"],
    searchStr: "",
    groupByName: false,
    startDate: "",
    endDate: "",
  });

  const [tableData, setTableData] = useState<ITableData[]>([]);
  const [usdtKoef, setUsdtKoef] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const filterBtnClick = () => setVisibleDatesPicker(!visibleDatesPicker);

  const getDonationsData = async () => {
    try {
      setLoading(true);
      const { timePeriod, searchStr, groupByName, startDate, endDate } =
        queryForm;

      const timePeriodQuery = getTimePeriodQuery(timePeriod);

      // timePeriod: string
      const { data } = await axiosClient.get(
        `/api/donation/page/data/${user.id}?roleplay=${
          user.roleplay
        }&limit=${LIMIT_DONATS}&offset=${0}&timePeriod=${timePeriodQuery}&startDate=${startDate}&endDate=${endDate}&groupByName=${groupByName}&searchStr=${searchStr}`
      );
      if (data.donations && data.donations.length) {
        const forTableData: ITableData[] = data.donations.map(
          (donat: any, key: number) => ({
            key: donat.id || key,
            name:
              user.roleplay === "creators"
                ? donat.username
                : donat.creator_username,
            donationToken: donat.sum_donation,
            donationUSD: (+donat.sum_donation * usdtKoef).toFixed(2),
            message: donat.donation_message || "-",
            date: donat.donation_date || "-",
            role: user.roleplay,
          })
        );
        setTableData(forTableData);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const sendQuery = async () => {
    await getDonationsData();
  };

  const allAmountUSD = useMemo(
    () => tableData.reduce((acc, donat) => acc + Number(donat.donationUSD), 0),
    [tableData]
  );

  useEffect(() => {
    getUsdKoef("evmos", setUsdtKoef);
  }, []);

  useEffect(() => {
    user.id && usdtKoef && getDonationsData();
  }, [user, usdtKoef]); // queryForm

  const isCreator = useMemo(
    () => user.roleplay && user.roleplay === "creators",
    [user]
  );

  const { timePeriod, searchStr, groupByName } = queryForm;

  const exportToExel = () => {
    const heading = tableColumns.reduce(
      (acc, curr) => ({ ...acc, [curr.key as string]: curr.title as string }),
      {}
    );

    const exelData: ITableData[] = tableData.map((d) =>
      Object.keys(d)
        .filter((d) => d !== "role" && d !== "key")
        .reduce(
          (acc, key) => ({ ...acc, [key]: d[key as keyof ITableData] }),
          initTableDataItem
        )
    );

    const wsColsData = Object.keys(heading)
      .filter((col) => col !== "role")
      .map((col) => ({
        wch: Math.max(
          ...exelData.map((d) => String(d[col as keyof ITableData]).length + 2)
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
    utils.sheet_add_json(ws, exelData, {
      header: tableColumns.map(({ key }) => key) as string[],
      skipHeader: true,
      origin: -1, //ok
    });
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    FileSaver.saveAs(data, "donations" + ".xlsx");
  };

  return (
    <>
      <PageTitle formatId="page_title_donations" />
      <div className="donations-header">
        <Row justify="space-between">
          <Col span={10}>
            <div className="donations-header__left">
              <Row justify="space-between">
                {isCreator && (
                  <Col span={14}>
                    <FormInput
                      name="widgetTitle"
                      value={searchStr || ""}
                      setValue={(value) =>
                        setQueryForm({ ...queryForm, searchStr: value })
                      }
                      placeholder="Search by name"
                      modificator={"donations-header__left_input"}
                      addonBefore={<SearchOutlined />}
                    />
                  </Col>
                )}
                <Col span={9}>
                  <SelectInput
                    value={timePeriod}
                    list={Object.values(filterPeriodItems)}
                    modificator={"donations-header__left_select"}
                    setValue={(selected) =>
                      setQueryForm({
                        ...queryForm,
                        timePeriod: selected as string,
                      })
                    }
                  />
                </Col>
                {!isCreator && (
                  <Col span={12}>
                    <BaseButton
                      formatId="create_filter_button"
                      onClick={filterBtnClick}
                      modificator={"donations-header__right_btn"}
                      icon={<CalendarIcon />}
                      isBlue={visibleDatesPicker}
                    />
                  </Col>
                )}
              </Row>
            </div>
          </Col>
          {isCreator && (
            <Col span={7}>
              <div className="donations-header__right">
                <Row justify="end">
                  {/* space-between */}
                  <Col span={11}>
                    <BaseButton
                      formatId="create_filter_button"
                      onClick={filterBtnClick}
                      modificator={"donations-header__right_btn"}
                      icon={<CalendarIcon />}
                      isBlue={visibleDatesPicker}
                    />
                  </Col>
                  <Col span={12}>
                    <BaseButton
                      formatId="create_export_button"
                      onClick={exportToExel}
                      modificator={"donations-header__right_btn"}
                      icon={<DownloadIcon />}
                    />
                  </Col>
                </Row>
              </div>
            </Col>
          )}
        </Row>
      </div>
      {visibleDatesPicker && (
        <div className="donations-selectDates">
          <p>Choose the exact time period</p>
          <DatesPicker
            setValue={(startDate, endDate) =>
              setQueryForm({ ...queryForm, startDate, endDate })
            }
          />
        </div>
      )}

      {isCreator && (
        <div className="donations-checkbox">
          <Checkbox
            onChange={(e: CheckboxChangeEvent) =>
              setQueryForm({ ...queryForm, groupByName: e.target.checked })
            }
            checked={groupByName}
          >
            Group donations with the same sender name
          </Checkbox>
        </div>
      )}
      <div>
        <BaseButton
          title="Show data"
          onClick={sendQuery}
          padding="8px 24px"
          fontSize="21px"
          isBlue
        />
      </div>
      <div className="donations-results">
        {isCreator && (
          <div className="donations-results__title">
            <p>
              Found {tableData.length} result for the amount of{" "}
              {allAmountUSD.toFixed(2)} USD
            </p>
          </div>
        )}
        <TableComponent
          loading={loading}
          dataSource={tableData}
          columns={tableColumns}
          pagination={{
            current: 1,
            pageSize: LIMIT_DONATS,
            position: ["bottomCenter"],
          }}
        />
      </div>
    </>
  );
};

export default DonationsContainer;
