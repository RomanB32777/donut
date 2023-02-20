import { FC, memo } from "react";
import clsx from "clsx";
import { FormattedMessage } from "react-intl";

import "./styles.sass";

interface IPageTitle {
  formatId?: string;
  title?: string;
  notMarginBottom?: boolean;
  modificator?: string;
}

const PageTitle: FC<IPageTitle> = ({
  formatId,
  title = "",
  notMarginBottom,
  modificator,
}) => {
  return (
    <div
      className={clsx("page-title", modificator)}
      style={{
        marginBottom: notMarginBottom ? 0 : 23,
      }}
    >
      <span>{formatId ? <FormattedMessage id={formatId} /> : title}</span>
    </div>
  );
};

export default memo(PageTitle);
