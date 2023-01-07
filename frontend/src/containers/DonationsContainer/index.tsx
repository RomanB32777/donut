import { useContext, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox, Col, Row } from "antd";
import FileSaver from "file-saver";
import { utils, write } from "xlsx";
import { SearchOutlined } from "@ant-design/icons";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { periodItemsTypes } from "types";

import { WalletContext } from "contexts/Wallet";
import PageTitle from "components/PageTitle";
import FormInput from "components/FormInput";
import DatesPicker from "components/DatesPicker";
import SelectInput from "components/SelectInput";
import TableComponent from "components/TableComponent";
import BaseButton from "components/BaseButton";
import { CalendarIcon, DownloadIcon } from "icons";
import useWindowDimensions from "hooks/useWindowDimensions";
import axiosClient from "modules/axiosClient";
import { setUpdateAppNotifications } from "store/types/Notifications";
import { getUsdKoef } from "utils";
import { initTableDataItem, ITableData, tableColumns } from "./tableData";
import { filterPeriodItems } from "consts";
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
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const { walletConf } = useContext(WalletContext);
  const { isMobile, isLaptop } = useWindowDimensions();

  const { list, shouldUpdateApp } = useSelector(
    (state: any) => state.notifications
  );
  const [visibleDatesPicker, setVisibleDatesPicker] = useState(false);
  const [queryForm, setQueryForm] = useState<IQueryForm>({
    timePeriod: "7days",
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
      const currBlockchain = await walletConf.getCurrentBlockchain();

      if (currBlockchain) {
        const queryFormString = Object.keys(queryForm).reduce(
          (acc, key) =>
            queryForm[key as keyof IQueryForm]
              ? acc + `&${key}=${queryForm[key as keyof IQueryForm]}`
              : acc,
          ""
        );
        const blockchain = currBlockchain.name;
        const { data } = await axiosClient.get(
          `/api/donation/page/data/${user.id}?roleplay=${user.roleplay}${queryFormString}&blockchain=${blockchain}`
        ); // &limit=${LIMIT_DONATS}&offset=${0}
        if (data.donations && data.donations.length) {
          const forTableData: ITableData[] = data.donations.map(
            (donat: any, key: number) => ({
              key: donat.id || key,
              name: donat.username,
              donationToken: donat.sum_donation,
              donationUSD: (+donat.sum_donation * usdtKoef).toFixed(2),
              message: donat.donation_message || "-",
              blockchain: donat.blockchain || blockchain,
              date: donat.created_at || "-",
              role: user.roleplay,
            })
          );
          setTableData(forTableData);
        } else {
          setTableData([]);
        }
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

  const allAmountUSD = useMemo(
    () => tableData.reduce((acc, donat) => acc + Number(donat.donationUSD), 0),
    [tableData]
  );

  useEffect(() => {
    dispatch(setUpdateAppNotifications(true));
    getUsdKoef(process.env.REACT_APP_BLOCKCHAIN || "evmos", setUsdtKoef);
  }, []);

  useEffect(() => {
    user.id && usdtKoef && shouldUpdateApp && getDonationsData();
  }, [user, usdtKoef, list, shouldUpdateApp]);

  const isCreator = useMemo(
    () => user.roleplay && user.roleplay === "creators",
    [user]
  );

  const { timePeriod, searchStr, groupByName } = queryForm;

  return (
    <>
      <PageTitle formatId="page_title_donations" />
      <div className="donations-header">
        <Row justify="space-between">
          <Col xl={12} md={14} xs={24}>
            <div className="donations-header__left">
              <Row justify="space-between">
                {isCreator && (
                  <Col md={13} xs={12}>
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
                <Col md={10} xs={11}>
                  <SelectInput
                    value={timePeriod}
                    list={Object.keys(filterPeriodItems).map((key) => ({
                      key,
                      value: filterPeriodItems[key as periodItemsTypes],
                    }))}
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
                  <Col md={12} xs={11}>
                    <BaseButton
                      formatId="create_filter_button"
                      onClick={filterBtnClick}
                      modificator={"donations-header__left_btn"}
                      icon={<CalendarIcon />}
                      isMain={visibleDatesPicker}
                    />
                  </Col>
                )}
              </Row>
            </div>
          </Col>
          {isCreator && (
            <Col xl={6} md={13} xs={24}>
              <div className="donations-header__right">
                <Row justify={isLaptop ? "start" : "end"}>
                  <Col xl={12}>
                    <BaseButton
                      formatId="create_filter_button"
                      onClick={filterBtnClick}
                      modificator="donations-header__right_btn"
                      icon={<CalendarIcon />}
                      isMain={visibleDatesPicker}
                    />
                  </Col>
                  <Col xl={12}>
                    <BaseButton
                      formatId="create_export_button"
                      onClick={exportToExel}
                      modificator="donations-header__right_btn"
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
          fontSize={isMobile ? "15px" : "18px"}
          isMain
        />
      </div>
      <div className="donations-results">
        {isCreator && (
          <div className="donations-results__title">
            <p>
              Found {tableData.length} result for the amount of&nbsp;
              {allAmountUSD.toFixed(2)} USD
            </p>
          </div>
        )}
        <TableComponent
          loading={loading}
          dataSource={tableData}
          columns={tableColumns}
          scroll={{
            scrollToFirstRowOnChange: true,
            x: true,
          }}
          pagination={{
            total: tableData.length,
            pageSize: LIMIT_DONATS,
            position: ["bottomCenter"],
            hideOnSinglePage: true,
          }}
        />
      </div>
    </>
  );
};

export default DonationsContainer;
