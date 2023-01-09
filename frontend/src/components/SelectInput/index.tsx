import { Col, Row, Select } from "antd";
import clsx from "clsx";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import "./styles.sass";

const { Option } = Select;

export interface ISelectItem {
  key: string;
  value: string;
}

const SelectInput = ({
  value,
  list,
  label,
  gutter,
  placeholder,
  modificator,
  labelCol,
  selectCol,
  isTags,
  disabled,
  showSearch,
  labelInValue,
  descriptionSelect,
  dropdownClassName,
  setValue,
  renderOption,
  dropdownRender,
}: {
  value: string | string[];
  list: ISelectItem[] | null; // string[]
  label?: string;
  gutter?: number | [number, number];
  placeholder?: string;
  modificator?: string;
  labelCol?: number;
  selectCol?: number;
  isTags?: boolean;
  disabled?: boolean;
  showSearch?: boolean;
  labelInValue?: boolean;
  descriptionSelect?: string;
  dropdownClassName?: string;
  setValue?: (value: string | string[], option?: any) => void;
  renderOption?: (item: ISelectItem) => React.ReactNode;
  dropdownRender?: (menu: React.ReactElement) => JSX.Element;
}) => {
  const { isMobile } = useWindowDimensions();

  return (
    <div className="selectInput">
      <Row gutter={gutter || 0}>
        <Col
          md={labelCol || (label ? 12 : 0)}
          xs={24}
          className="selectInput__label_wrapper"
        >
          <span className="selectInput__label">{label}</span>
        </Col>
        <Col
          md={selectCol || (label ? 12 : 24)}
          xs={24}
          className={clsx("selectInput__input", {
            [modificator as string]: modificator,
          })}
        >
          <Select
            value={
              Array.isArray(value)
                ? (value as string[])
                : (value as string) || null
            }
            placeholder={placeholder || ""}
            mode={isTags ? "tags" : undefined}
            onChange={setValue}
            disabled={(list && Boolean(list.length)) || disabled ? false : true}
            dropdownRender={dropdownRender}
            popupClassName={dropdownClassName}
            optionLabelProp="title"
            showSearch={showSearch}
            labelInValue={labelInValue}
            showArrow
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
            offset={(!isMobile ? labelCol : 0) || (label && !isMobile ? 12 : 0)}
            md={selectCol || (label ? 12 : 24)}
          >
            <p className="selectInput__description">{descriptionSelect}</p>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default SelectInput;
