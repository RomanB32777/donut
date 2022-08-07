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
            onChange={props.onChange}
            placeholder={intl.formatMessage({ id: props.placeholder || "" })}
          />
        ) : (
          <input
            maxLength={props.maxlength || 524288}
            type={props.type || "text"}
            onChange={props.onChange}
            placeholder={intl.formatMessage({ id: props.placeholder || "" })}
          />
        ))}
      <span className="large-input__subtitle">Maximum number of characters - {props.maxlength}</span>
    </div>
  );
};

export default LargeInput;
