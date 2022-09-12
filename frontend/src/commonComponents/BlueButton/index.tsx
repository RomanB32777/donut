import clsx from "clsx";
import { FormattedMessage } from "react-intl";
import "./styles.sass";

const BlueButton = (props: {
  formatId: string;
  padding: string;
  fontSize: string;
  icon?: React.ReactNode;
  onClick: () => void;
}) => (
  <div
    className={clsx("blue-button", {
      withIcon: Boolean(props.icon),
    })}
    onClick={props.onClick}
    style={{
      padding: props.padding,
      fontSize: props.fontSize,
    }}
  >
    <FormattedMessage id={props.formatId} />
    {props.icon && <div className="blue-button">{props.icon}</div>}
  </div>
);

export default BlueButton;
