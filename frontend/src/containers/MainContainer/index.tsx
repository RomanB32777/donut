import { useEffect, useState } from "react";
import { Col, Row } from "antd";
import PageTitle from "../../components/PageTitle";
import WidgetStat from "./widgets/WidgetStat";
import WidgetTopSup from "./widgets/WidgetTopSup";
import WidgetTopDonat from "./widgets/WidgetTopDonat";
import WidgetLatestDonat from "./widgets/WidgetLatestDonat";
import { getUsdKoef } from "../../utils";
import "./styles.sass";

const MainContainer = () => {
  const [usdtKoef, setUsdtKoef] = useState<number>(0)

  useEffect(() => {
    getUsdKoef(process.env.REACT_APP_BLOCKCHAIN || "evmos", setUsdtKoef);
  }, [])

  return (
    <>
      <PageTitle formatId="page_title_dashboard" />
      <Row gutter={[16, 16]} className="widgets_container">
        <Col xs={24} lg={14}>
          <WidgetStat usdtKoef={usdtKoef} />
          <WidgetTopSup usdtKoef={usdtKoef} />
        </Col>
        <Col xs={24} lg={10}>
          <WidgetLatestDonat usdtKoef={usdtKoef} />
        </Col>
        <Col span={24}>
          <WidgetTopDonat usdtKoef={usdtKoef} />
        </Col>
      </Row>
    </>
  );
};

export default MainContainer;
