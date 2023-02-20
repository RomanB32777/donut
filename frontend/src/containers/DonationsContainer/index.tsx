import { useCallback, useEffect, useMemo, useState } from "react";
import { createSelector } from "@reduxjs/toolkit";
import { Checkbox, Col, Row } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { IDonationsQueryData, periodItemsTypes, userRoles } from "types";

import PageTitle from "components/PageTitle";
import FormInput from "components/FormInput";
import DatesPicker from "components/DatesPicker";
import SelectInput from "components/SelectInput";
import TableComponent from "components/TableComponent";
import BaseButton from "components/BaseButton";
import { CalendarIcon, DownloadIcon } from "icons";

import { useActions, useAppSelector } from "hooks/reduxHooks";
import { useGetDonationsPageQuery } from "store/services/DonationsService";
import useWindowDimensions from "hooks/useWindowDimensions";
import { ITableData, tableColumns } from "./tableData";
import { formatNumber } from "utils";
import { exportToExcel } from "./utils";
import { filterPeriodItems } from "consts";

import "./styles.sass";

const LIMIT_DONATS = 15;

const DonationsContainer = () => {
  const { setUpdatedFlag } = useActions();
  const { id, roleplay, spam_filter } = useAppSelector(({ user }) => user);
  const { list, shouldUpdateApp } = useAppSelector(
    ({ notifications }) => notifications
  );
  const { isLaptop } = useWindowDimensions();

  const [visibleDatesPicker, setVisibleDatesPicker] = useState(false);
  const [queryForm, setQueryForm] = useState<IDonationsQueryData>({
    timePeriod: "7days",
    searchStr: "",
    groupByName: false,
    startDate: "",
    endDate: "",
  });

  const { timePeriod, searchStr, groupByName } = queryForm;

  const selectTableData = useMemo(
    () =>
      createSelector(
        (res: any) => res.data,
        (res: any, roleplay: userRoles) => roleplay,
        (data, roleplay) => {
          const forTableData: ITableData[] = data?.map(
            (donat: any, key: number) => ({
              key: donat.id || key,
              name: donat.username,
              donationToken: +formatNumber(donat.sum_donation),
              donationUSD: +formatNumber(donat.sum_usd_donation),
              blockchain: donat.blockchain,
              date: donat.created_at || "-",
              role: roleplay,
              message: donat.donation_message,
            })
          );
          return forTableData ?? [];
        }
      ),
    []
  );

  const {
    tableData,
    isLoading,
    refetch: sendQuery,
  } = useGetDonationsPageQuery(
    {
      userID: id,
      query: {
        roleplay,
        spam_filter,
        ...queryForm,
      },
    },
    {
      skip: !id,
      selectFromResult: (result) => ({
        ...result,
        tableData: selectTableData(result, roleplay),
      }),
    }
  );

  const filterBtnClick = useCallback(
    () => setVisibleDatesPicker(!visibleDatesPicker),
    [visibleDatesPicker]
  );

  const exportExcelHandler = useCallback(
    () => exportToExcel(tableData),
    [tableData]
  );

  const allAmountUSD = useMemo(
    () => tableData.reduce((acc, donat) => acc + Number(donat.donationUSD), 0),
    [tableData]
  );

  const isCreator = useMemo(
    () => roleplay && roleplay === "creators",
    [roleplay]
  );

  useEffect(() => {
    setUpdatedFlag(true);
  }, []);

  useEffect(() => {
    list.length && shouldUpdateApp && sendQuery();
  }, [list, shouldUpdateApp]);

  return (
    <div className="donations-container fadeIn">
      <PageTitle formatId="page_title_donations" />
      <div className="header">
        <Row justify="space-between">
          <Col xl={12} md={14} xs={24}>
            <div className="left">
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
                      modificator="input"
                      addonsModificator="search-icon"
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
                    modificator="select"
                    onChange={(selected) =>
                      setQueryForm({
                        ...queryForm,
                        timePeriod: selected,
                      })
                    }
                    disabled={visibleDatesPicker}
                  />
                </Col>
                {!isCreator && (
                  <Col md={12} xs={11}>
                    <BaseButton
                      formatId="create_filter_button"
                      onClick={filterBtnClick}
                      modificator="btn"
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
              <div className="right">
                <Row justify={isLaptop ? "start" : "end"}>
                  <Col xl={12}>
                    <BaseButton
                      formatId="create_filter_button"
                      onClick={filterBtnClick}
                      modificator="btn"
                      icon={<CalendarIcon />}
                      isMain={visibleDatesPicker}
                    />
                  </Col>
                  <Col xl={12}>
                    <BaseButton
                      formatId="create_export_button"
                      onClick={exportExcelHandler}
                      modificator="btn"
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
        <div className="selectDates fadeIn">
          <p>Choose the exact time period</p>
          <DatesPicker
            setValue={(startDate, endDate) =>
              setQueryForm({ ...queryForm, startDate, endDate })
            }
          />
        </div>
      )}

      {isCreator && (
        <div className="checkbox">
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
      {/* <div>
        <BaseButton
          title="Show data"
          onClick={sendQuery}
          padding="8px 24px"
          fontSize={isMobile ? "15px" : "18px"}
          isMain
        />
      </div> */}
      <div className="results">
        {isCreator && (
          <div className="title">
            <p>
              Found {tableData.length} result for the amount of&nbsp;
              {formatNumber(allAmountUSD)} USD
            </p>
          </div>
        )}
        <TableComponent
          loading={isLoading}
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
    </div>
  );
};

export default DonationsContainer;
