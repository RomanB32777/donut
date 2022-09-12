import { Col, Row } from "antd";
import clsx from "clsx";
import "./styles.sass";

const FormInput = ({
  label,
  value,
  name,
  placeholder,
  typeInput,
  modificator,
  descriptionInput,
  isTextarea,
  InputCol,
  labelCol,
  addonBefore,
  addonAfter,
  setValue,
}: {
  label?: string;
  value: string;
  name: string;
  placeholder?: string;
  typeInput?: string;
  modificator?: string;
  descriptionInput?: string;
  isTextarea?: boolean;
  InputCol?: number;
  labelCol?: number;
  addonBefore?: React.ReactNode;
  addonAfter?: React.ReactNode;
  setValue?: (value: string) => void;
}) => {
  const idForInput = `form_el_${name.split(" ").join("_")}`;
  return (
    <div className="formInput">
      <Row>
        <Col
          span={labelCol || (label ? 12 : 0)}
          className={clsx({
            alignCenter: !isTextarea,
          })}
        >
          <span className="formInput__label">{label}</span>
        </Col>
        <Col
          span={InputCol || (label ? 12 : 24)}
          className={clsx("formInput__input", {
            [modificator as string]: modificator,
          })}
        >
          {addonBefore && (
            <div className="formInput__input_addonBefore">{addonBefore}</div>
          )}
          {isTextarea ? (
            <textarea
              className={clsx({
                withAddonAfter: Boolean(addonAfter),
                withAddonBefore: Boolean(addonBefore),
              })}
              disabled={!Boolean(setValue)}
              name={name}
              placeholder={placeholder || ""}
              value={value}
              id={idForInput}
              onChange={(e) => setValue && setValue(e.target.value)}
            />
          ) : (
            <input
              className={clsx({
                withAddonAfter: Boolean(addonAfter),
                withAddonBefore: Boolean(addonBefore),
              })}
              disabled={!Boolean(setValue)}
              name={name}
              placeholder={placeholder || ""}
              type={typeInput || "text"}
              value={value}
              id={idForInput}
              onChange={(e) => setValue && setValue(e.target.value)}
            />
          )}
          {addonAfter && (
            <div className="formInput__input_addonAfter">{addonAfter}</div>
          )}
        </Col>
      </Row>
      {descriptionInput && (
        <Row>
          <Col
            offset={labelCol || (label ? 12 : 0)}
            span={InputCol || (label ? 12 : 24)}
          >
            <p className="formInput__description">{descriptionInput}</p>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default FormInput;
