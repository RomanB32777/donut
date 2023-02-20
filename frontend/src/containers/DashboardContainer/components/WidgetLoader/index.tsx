import Loader from "components/Loader";
import { memo } from "react";
import "./styles.sass";

const WidgetLoader = () => (
  <div className="widget-loader">
    <Loader size="small" />
  </div>
);

export default memo(WidgetLoader);
