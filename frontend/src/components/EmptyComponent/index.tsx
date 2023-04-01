import { Empty } from "antd";
import { FormattedMessage } from "react-intl";

const EmptyComponent = () => (
  <Empty
    className="empty-el"
    image={Empty.PRESENTED_IMAGE_SIMPLE}
    description={<FormattedMessage id="empty_data" />}
  />
);

export default EmptyComponent;
