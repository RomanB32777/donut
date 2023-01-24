import { HTMLInputTypeAttribute, useState } from "react";
import { Col, Row } from "antd";
import clsx from "clsx";

import useWindowDimensions from "hooks/useWindowDimensions";
import "./styles.sass";

const FormInput = ({
  label,
  value,
  name,
  placeholder,
  typeInput,
  disabled,
  modificator,
  descriptionModificator,
  addonsModificator,
  descriptionInput,
  maxLength,
  isTextarea,
  isVisibleLength,
  inputCol,
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
  descriptionModificator?: string;
  addonsModificator?: string;
  descriptionInput?: React.ReactNode;
  maxLength?: number;
  isTextarea?: boolean;
  isVisibleLength?: boolean;
  inputCol?: number;
  labelCol?: number;
  gutter?: number | [number, number];
  addonBefore?: React.ReactNode;
  addonAfter?: React.ReactNode;
  setValue?: (value: string) => void;
}) => {
  const { isMobile } = useWindowDimensions();
  const [active, setActive] = useState(false);

  const onFocus = () => setActive(true);

  const onBlur = () => setActive(false);

  return (
    <div className="formInput">
      <Row gutter={gutter || 0}>
        {label && (
          <Col
            md={labelCol || 12}
            xs={24}
            className={clsx({
              alignCenter: !isTextarea,
            })}
          >
            <span className="label">{label}</span>
          </Col>
        )}
        <Col md={inputCol || (label ? 12 : 24)} xs={24}>
          <div className={clsx("input", modificator)}>
            {addonBefore && (
              <div
                className={clsx("addonBefore", addonsModificator, { active })}
              >
                {addonBefore}
              </div>
            )}
            {isTextarea ? (
              <textarea
                className={clsx({
                  withAddonAfter: Boolean(addonAfter),
                  withAddonBefore: Boolean(addonBefore),
                })}
                disabled={disabled || !Boolean(setValue)}
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
                value={value}
                onChange={(e) => setValue && setValue(e.target.value)}
                onFocus={onFocus}
                onBlur={onBlur}
                disabled={disabled || !Boolean(setValue)}
                name={name || ""}
                placeholder={placeholder || ""}
                type={typeInput || "text"}
                min={0}
                maxLength={maxLength || 524288}
                onWheel={(e) => e.currentTarget.blur()}
              />
            )}
            {isVisibleLength && (
              <p className="value-length">
                {value.length}/{maxLength}
              </p>
            )}
            {addonAfter && (
              <div
                className={clsx("addonAfter", addonsModificator, { active })}
              >
                {addonAfter}
              </div>
            )}
          </div>
        </Col>
      </Row>
      {descriptionInput && (
        <Row>
          <Col
            offset={(!isMobile ? labelCol : 0) || (label && !isMobile ? 12 : 0)}
            md={inputCol || (label ? 12 : 24)}
            xs={24}
          >
            <div className={clsx("description", descriptionModificator)}>
              {descriptionInput}
            </div>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default FormInput;
