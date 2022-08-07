import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import "./styles.sass";

const LargeInput = (props: {
  title: string;
  subtitle?: string;
  placeholder?: string;
  isRedDot?: boolean;
  isTextarea?: boolean;
  maxlength?: number;
  type?: string;
  onChange: (event: any) => void;
}) => {
  const intl = useIntl();
  const [inputValueLength, setInputValueLength] = useState(0);
  const [textareaValueLength, setTextareaValueLength] = useState(0);

  return (
    <div className="large-input">
      <span className="large-input__title">
        <FormattedMessage id={props.title} />
        {props.isRedDot && <span>*</span>}
      </span>

      {props.subtitle && (
        <span className="large-input__subtitle">
          <FormattedMessage id={props.subtitle} />
        </span>
      )}

      {props.title !== "create_badge_form_icon_title" &&
        (props.isTextarea ? (
          <textarea
            maxLength={props.maxlength || 524288}
            onChange={(e) => {
              setTextareaValueLength(e.target.value.length);
              props.onChange(e);
            }}
            placeholder={intl.formatMessage({ id: props.placeholder || "" })}
          />
        ) : (
          <input
            maxLength={props.maxlength || 524288}
            type={props.type || "text"}
            onChange={(e) => {
              setInputValueLength(e.target.value.length);
              props.onChange(e);
            }}
            placeholder={intl.formatMessage({ id: props.placeholder || "" })}
          />
        ))}
      {props.maxlength && (
        <span className="large-input__subtitle">
          Number of input characters -{" "}
          {props.isTextarea ? textareaValueLength : inputValueLength} /
          {props.maxlength}
        </span>
      )}
    </div>
  );
};

export default LargeInput;
