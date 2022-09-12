import { Col, Row, Select } from "antd";
import clsx from "clsx";
import "./styles.sass";

const { Option } = Select;

const SelectInput = ({
  label,
  value,
  list,
  modificator,
  InputCol,
  SelectCol,
  setValue,
}: {
  label?: string;
  value: string;
  list: string[];
  modificator?: string;
  InputCol?: number;
  SelectCol?: number;
  setValue?: (value: string) => void;
}) => {
  return (
    <div className="selectInput">
      <Row>
        <Col
          span={SelectCol || (label ? 12 : 0)}
          className="selectInput__label_wrapper"
        >
          <span className="selectInput__label">{label}</span>
        </Col>
        <Col
          span={InputCol || (label ? 12 : 24)}
          className={clsx("selectInput__input", {
            [modificator as string]: modificator,
          })}
        >
          <Select defaultValue={value} onChange={setValue} bordered={false}>
            {list.map((item) => (
              <Option value={item} key={item}>
                {item}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>
    </div>
  );
};

export default SelectInput;
