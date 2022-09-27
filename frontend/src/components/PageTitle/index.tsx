import { FormattedMessage } from "react-intl";

import "./styles.sass";

const PageTitle = (prop: { formatId: string; notMarginBottom?: boolean }) => {
  return (
    <div
      className="page-title"
      style={{
        marginBottom: prop.notMarginBottom ? 0 : 23,
      }}
    >
      <span>
        <FormattedMessage id={prop.formatId} />
      </span>
    </div>
  );
};

export default PageTitle;
