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
  isRed?: boolean;
  isBlack?: boolean;
  disabled?: boolean;
  color?: string,
  modificator?: string;
  onClick: (event?: React.MouseEvent<HTMLDivElement>) => void;
}) => (
  <div
    className={clsx("base-button", {
      blueButton: props.isBlue,
      redButton: props.isRed,
      blackButton: props.isBlack,
      withIcon: Boolean(props.icon),
      disabled: props.disabled || false,
      [props.modificator as string]: props.modificator,
    })}
    onClick={props.onClick}
    style={{
      padding: props.padding,
      fontSize: props.fontSize,
      background: props.color,
      borderColor: props.color,
    }}
  >
    {props.formatId && <FormattedMessage id={props.formatId} />}
    {props.title}
    {props.icon && <div className="base-button__icon icon">{props.icon}</div>}
  </div>
);

export default BaseButton;
