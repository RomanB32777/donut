import { FC } from "react";
import clsx from "clsx";
import { Col, Row, RowProps, Select, SelectProps } from "antd";

import useWindowDimensions from "hooks/useWindowDimensions";
import "./styles.sass";

const { Option } = Select;

export interface ISelectItem {
  key: string;
  value: string;
}

interface ISelectInput extends SelectProps {
  list: ISelectItem[] | null; // string[]
  label?: string;
  gutter?: number | [number, number];
  modificator?: string;
  labelModificator?: string;
  labelCol?: number;
  selectCol?: number;
  isTags?: boolean;
  disabled?: boolean;
  descriptionSelect?: string;
  rowProps?: RowProps;
  offset?: number;
  renderOption?: (item: ISelectItem) => React.ReactNode;
}

const SelectInput: FC<ISelectInput> = ({
  value,
  list,
  label,
  gutter,
  placeholder,
  modificator,
  labelModificator,
  labelCol,
  selectCol,
  isTags,
  disabled = false,
  offset,
  rowProps,
  showSearch,
  labelInValue,
  descriptionSelect,
  popupClassName,
  onChange,
  renderOption,
  dropdownRender,
  onDropdownVisibleChange,
}) => {
  const { isMobile } = useWindowDimensions();
  return (
    <div className="selectInput">
      <Row gutter={gutter || 0} {...rowProps}>
        {label && (
          <Col md={labelCol || 12} xs={24} className="label_wrapper">
            <span className={clsx("label", labelModificator)}>{label}</span>
          </Col>
        )}
        <Col
          md={selectCol || (label ? 12 : 24)}
          xs={24}
          className={clsx("input", modificator)}
        >
          <Select
            value={
              Array.isArray(value)
                ? (value as string[])
                : (value as string) || null
            }
            className="app-select"
            placeholder={placeholder || ""}
            mode={isTags ? "tags" : undefined}
            onChange={onChange}
            disabled={!(list && Boolean(list.length)) || disabled}
            dropdownRender={dropdownRender}
            popupClassName={clsx("app-dropdown", popupClassName)}
            optionLabelProp="title"
            showSearch={showSearch}
            labelInValue={labelInValue}
            onDropdownVisibleChange={onDropdownVisibleChange}
            showArrow
            // suffixIcon={<SmallToggleListArrowIcon />}
            // bordered={false}
            // open={true}
          >
            {list &&
              list.map(({ key, value }) => (
                <Option value={key} key={key} title={value}>
                  {renderOption ? renderOption({ value, key }) : value}
                </Option>
              ))}
          </Select>
        </Col>
      </Row>
      {descriptionSelect && (
        <Row>
          <Col
            offset={(!isMobile ? (offset || labelCol) : 0) || (label && !isMobile ? 12 : 0)}
            md={selectCol || (label ? 12 : 24)}
          >
            <p className="description">{descriptionSelect}</p>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default SelectInput;
