import clsx from "clsx";
import { FormattedMessage } from "react-intl";

import "./styles.sass";

const PageTitle = ({
  formatId,
  title = "",
  notMarginBottom,
  modificator,
}: {
  formatId?: string;
  title?: string;
  notMarginBottom?: boolean;
  modificator?: string;
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

export default PageTitle;
