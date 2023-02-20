import { memo } from "react";
import clsx from "clsx";
import { FormattedMessage } from "react-intl";
import "./styles.sass";

const BaseButton = ({
  formatId,
  title,
  padding,
  fontSize,
  icon,
  isMain,
  isRed,
  isBlack,
  disabled,
  color,
  modificator,
  onClick,
}: {
  formatId?: string;
  title?: string;
  padding?: string;
  fontSize?: string;
  icon?: React.ReactNode;
  isMain?: boolean;
  isRed?: boolean;
  isBlack?: boolean;
  disabled?: boolean;
  color?: string;
  modificator?: string;
  onClick?: (event?: React.MouseEvent<HTMLDivElement>) => void;
}) => {
  return (
    <div
      className={clsx("base-button", {
        mainButton: isMain,
        redButton: isRed,
        blackButton: isBlack,
        withIcon: Boolean(icon),
        disabled: disabled || false,
        [modificator as string]: modificator,
      })}
      onClick={onClick}
      style={{
        padding: padding,
        fontSize: fontSize,
        background: color,
        borderColor: color,
      }}
    >
      {formatId && <FormattedMessage id={formatId} />}
      {title}
      {icon && <div className="base-button__icon icon">{icon}</div>}
    </div>
  );
};

export default memo(BaseButton);
