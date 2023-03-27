import { HTMLInputTypeAttribute, useState } from "react";
import { Col, Row, RowProps } from "antd";
import { useIntl } from "react-intl";
import clsx from "clsx";

import useWindowDimensions from "hooks/useWindowDimensions";
import "./styles.sass";

interface IFormInput {
  value: string;
  label?: React.ReactNode;
  name?: string;
  placeholder?: string;
  placeholderValues?: Record<string, string | number>;
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
  rowProps?: RowProps;
  addonBefore?: React.ReactNode;
  addonAfter?: React.ReactNode;
  setValue?: (value: string) => void;
}

const FormInput = ({
  label,
  value,
  name,
  placeholder,
  placeholderValues,
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
  rowProps,
  addonBefore,
  addonAfter,
  setValue,
}: IFormInput) => {
  const intl = useIntl();
  const { isMobile } = useWindowDimensions();
  const [active, setActive] = useState(false);

  const onFocus = () => setActive(true);

  const onBlur = () => setActive(false);

  const onWheel = (e: React.WheelEvent<HTMLInputElement>) =>
    e.currentTarget.blur();

  const changeHandler = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => setValue && setValue(e.target.value);

  return (
    <div className="formInput">
      <Row gutter={gutter || 0} {...rowProps}>
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
                placeholder={
                  placeholder
                    ? intl.formatMessage(
                        { id: placeholder },
                        { ...placeholderValues }
                      )
                    : ""
                }
                maxLength={maxLength || 524288}
                value={value}
                onChange={changeHandler}
              />
            ) : (
              <input
                className={clsx({
                  withAddonAfter: Boolean(addonAfter),
                  withAddonBefore: Boolean(addonBefore),
                })}
                value={value}
                onChange={changeHandler}
                onFocus={onFocus}
                onBlur={onBlur}
                disabled={disabled || !Boolean(setValue)}
                name={name}
                placeholder={
                  placeholder ? intl.formatMessage({ id: placeholder }) : ""
                }
                type={typeInput || "text"}
                maxLength={maxLength || 524288}
                onWheel={onWheel}
                min={0}
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
