import { Col, Row, Select } from "antd";
import clsx from "clsx";
import "./styles.sass";

const { Option } = Select;

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
  descriptionSelect,
  setValue,
}: {
  value: string | string[];
  list: string[];
  label?: string;
  gutter?: number | [number, number];
  placeholder?: string;
  modificator?: string;
  labelCol?: number;
  selectCol?: number;
  isTags?: boolean;
  descriptionSelect?: string;
  setValue?: (value: string | string[]) => void;
}) => {
  return (
    <div className="selectInput">
      <Row gutter={gutter || 0}>
        <Col
          span={labelCol || (label ? 12 : 0)}
          className="selectInput__label_wrapper"
        >
          <span className="selectInput__label">{label}</span>
        </Col>
        <Col
          span={selectCol || (label ? 12 : 24)}
          className={clsx("selectInput__input", {
            [modificator as string]: modificator,
          })}
        >
          <Select
            value={
              Array.isArray(value) ? (value as string[]) : (value as string || null)
            }
            placeholder={placeholder || ""}
            mode={isTags ? "tags" : undefined}
            onChange={setValue}
            // bordered={false}
            showArrow
          >
            {list.map((item) => (
              <Option value={item} key={item}>
                {item}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>
      {descriptionSelect && (
        <Row>
          <Col
            offset={labelCol || (label ? 12 : 0)}
            span={selectCol || (label ? 12 : 24)}
          >
            <p className="selectInput__description">{descriptionSelect}</p>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default SelectInput;
