import clsx from "clsx";
import { FormattedMessage } from "react-intl";
import "./styles.sass";

const BaseButton = (props: {
  formatId?: string;
  title?: string;
  padding?: string;
  fontSize?: string;
  icon?: React.ReactNode;
  isBlue?: boolean;
  disabled?: boolean;
  modificator?: string;
  onClick: () => void;
}) => (
  <div
    className={clsx("base-button", {
      blueButton: props.isBlue,
      withIcon: Boolean(props.icon),
      disabled: props.disabled || false,
      [props.modificator as string]: props.modificator,
    })}
    onClick={props.onClick}
    style={{
      padding: props.padding,
      fontSize: props.fontSize,
    }}
  >
    {props.formatId && <FormattedMessage id={props.formatId} />}
    {props.title}
    {props.icon && <div className="base-button__icon icon">{props.icon}</div>}
  </div>
);

export default BaseButton;
