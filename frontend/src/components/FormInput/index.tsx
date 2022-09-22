import { HTMLInputTypeAttribute } from "react";
import { Col, Row } from "antd";
import clsx from "clsx";
import "./styles.sass";

const FormInput = ({
  label,
  value,
  name,
  placeholder,
  typeInput,
  disabled,
  modificator,
  descriptionInput,
  maxLength,
  isTextarea,
  InputCol,
  labelCol,
  gutter,
  addonBefore,
  addonAfter,
  setValue,
}: {
  value: string;
  label?: string;
  name?: string;
  placeholder?: string;
  typeInput?: HTMLInputTypeAttribute;
  disabled?: boolean;
  modificator?: string;
  descriptionInput?: string;
  maxLength?: number;
  isTextarea?: boolean;
  InputCol?: number;
  labelCol?: number;
  gutter?: number | [number, number];
  addonBefore?: React.ReactNode;
  addonAfter?: React.ReactNode;
  setValue?: (value: string) => void;
}) => {
  // const idForInput = `form_el_${name.split(" ").join("_")}`;
  return (
    <div className="formInput">
      <Row gutter={gutter || 0}>
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
              name={name || ""}
              placeholder={placeholder || ""}
              maxLength={maxLength || 524288}
              value={value}
              onChange={(e) => setValue && setValue(e.target.value)}
            />
          ) : (
            <input
              className={clsx({
                withAddonAfter: Boolean(addonAfter),
                withAddonBefore: Boolean(addonBefore),
              })}
              disabled={disabled || !Boolean(setValue)}
              name={name || ""}
              placeholder={placeholder || ""}
              type={typeInput || "text"}
              min={0}
              maxLength={maxLength || 524288}
              onWheel={(e) => e.currentTarget.blur()}
              value={value}
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
