import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Checkbox, Col, Row } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import PageTitle from "../../commonComponents/PageTitle";
import FormInput from "../../components/FormInput";
import DatesPicker from "../../components/DatesPicker";
import SelectInput from "../../components/SelectInput";
import TableComponent from "../../components/TableComponent";
import BaseButton from "../../commonComponents/BaseButton";
import { CalendarIcon, DownloadIcon } from "../../icons/icons";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { data, ITableData, tableColumns } from "./tableData";
import "./styles.sass";
import { userRoles } from "../../routes";

const DonationsContainer = () => {
  const user = useSelector((state: any) => state.user);
  const [visibleDatesPicker, setVisibleDatesPicker] = useState(false);
  const onCheckbox = (e: CheckboxChangeEvent) => {
    console.log(`checked = ${e.target.checked}`);
  };
  const filterBtnClick = () => setVisibleDatesPicker(!visibleDatesPicker);

  const isCreator = useMemo(
    () => user.roleplay && user.roleplay === "creators",
    [user]
  );

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
                      value={""}
                      placeholder="Search by name"
                      modificator={"donations-header__left_input"}
                      addonBefore={<SearchOutlined />}
                    />
                  </Col>
                )}
                <Col span={9}>
                  <SelectInput
                    list={["Today", "Last 7 days", "Last 30 days", "This year"]}
                    value={"Last 7 days"}
                    modificator={"donations-header__left_select"}
                    setValue={(value) => console.log(value)}
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
            <Col span={6}>
              <div className="donations-header__right">
                <Row justify="space-between">
                  <Col span={12}>
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
                      onClick={() => console.log("true")}
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
          <DatesPicker />
        </div>
      )}
      {isCreator && (
        <div className="donations-checkbox">
          <Checkbox onChange={onCheckbox}>
            Group donations with the same sender name
          </Checkbox>
        </div>
      )}
      <div className="donations-results">
        {isCreator && (
          <div className="donations-results__title">
            <p>Found 30 donations for the amount of 500 USD</p>
          </div>
        )}
        <TableComponent
          dataSource={data}
          columns={tableColumns}
          pagination={{
            current: 1,
            pageSize: 5,
            position: ["bottomCenter"],
          }}
        />
      </div>
    </>
  );
};

export default DonationsContainer;
