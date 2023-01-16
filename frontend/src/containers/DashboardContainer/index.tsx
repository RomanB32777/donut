import { useEffect } from "react";
import { Col, Row } from "antd";
import { useDispatch } from "react-redux";

import PageTitle from "components/PageTitle";
import WidgetStat from "./components/WidgetStat";
import WidgetTopSup from "./components/WidgetTopSup";
import WidgetTopDonat from "./components/WidgetTopDonat";
import WidgetLatestDonat from "./components/WidgetLatestDonat";

// import { useAppSelector } from "hooks/reduxHooks";
import { setUpdateAppNotifications } from "store/types/Notifications";
import "./styles.sass";

const DashboardContainer = () => {
  const dispatch = useDispatch();
  // const notifications = useAppSelector(({ notifications }) => notifications);

  useEffect(() => {
    dispatch(setUpdateAppNotifications(true));
  }, []); // [notifications] // ???

  return (
    <div className="dashboard-container fadeIn">
      <PageTitle formatId="page_title_dashboard" />
      <Row gutter={[16, 16]} className="widgets_container">
        <Col xs={24} lg={14}>
          <WidgetStat />
          <WidgetTopSup />
        </Col>
        <Col xs={24} lg={10}>
          <WidgetLatestDonat />
        </Col>
        <Col span={24}>
          <WidgetTopDonat />
        </Col>
      </Row>
    </div>
  );
};

export default DashboardContainer;
