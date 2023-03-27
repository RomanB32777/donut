import { useCallback, useEffect, useMemo, useState } from "react";
import { createSelector } from "@reduxjs/toolkit";
import { Checkbox, Col, Row } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { FormattedMessage, useIntl } from "react-intl";
import { donationsQueryData, periodItemsTypes, userRoles } from "types";

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
import { IDonationWidgetInfo } from "appTypes";

const LIMIT_DONATS = 15;

const DonationsContainer = () => {
  const intl = useIntl();
  const { setUpdatedFlag } = useActions();
  const { id, roleplay, creator } = useAppSelector(({ user }) => user);
  const { list, shouldUpdateApp } = useAppSelector(
    ({ notifications }) => notifications
  );
  const { isLaptop } = useWindowDimensions();

  const [visibleDatesPicker, setVisibleDatesPicker] = useState(false);
  const [queryForm, setQueryForm] = useState<
    donationsQueryData<periodItemsTypes>
  >({
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
        (res: IDonationWidgetInfo[] | undefined) => res,
        (res: IDonationWidgetInfo[] | undefined, roleplay: userRoles) =>
          roleplay,
        (data, roleplay) => {
          if (data) {
            const forTableData = data.reduce<ITableData[]>(
              (
                data,
                {
                  id,
                  creator,
                  backer,
                  blockchainSum,
                  sum,
                  blockchain,
                  message,
                  createdAt,
                }
              ) => {
                data.push({
                  key: id,
                  name:
                    roleplay === "backers" ? creator.username : backer.username,
                  donationToken: blockchainSum
                    ? +formatNumber(blockchainSum)
                    : 0,
                  donationUSD: +formatNumber(sum),
                  blockchain: blockchain,
                  date: createdAt || "-",
                  role: roleplay,
                  message: message,
                });
                return data;
              },
              []
            );
            return forTableData;
          }
          return [];
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
      userId: id,
      query: {
        roleplay,
        spamFilter: creator?.spamFilter,
        ...queryForm,
      },
    },
    {
      skip: !id,
      selectFromResult: (result) => ({
        ...result,
        tableData: selectTableData(result.data, roleplay),
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
                      placeholder="donations_search_placeholder"
                      modificator="input"
                      addonsModificator="search-icon"
                      addonBefore={<SearchOutlined />}
                    />
                  </Col>
                )}
                <Col md={10} xs={11}>
                  <SelectInput
                    value={{
                      value: timePeriod,
                      label: intl.formatMessage({
                        id: filterPeriodItems[timePeriod || "7days"],
                      }),
                    }}
                    list={Object.keys(filterPeriodItems).map((key) => ({
                      key,
                      value: filterPeriodItems[key as periodItemsTypes],
                    }))}
                    renderOption={(item) =>
                      intl.formatMessage({ id: item.value })
                    }
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
          <p>
            <FormattedMessage id="donations_select_dates" />
          </p>
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
            <FormattedMessage id="donations_group_checkbox" />
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
              <FormattedMessage
                id="donations_found_txt"
                values={{
                  num: tableData.length,
                  amount: formatNumber(allAmountUSD),
                }}
              />
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
