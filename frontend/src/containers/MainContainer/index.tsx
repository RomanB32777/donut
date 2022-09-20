import { useEffect, useState } from "react";
import postData from "../../functions/postData";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import routes from "../../routes";
import { tryToGetUser } from "../../store/types/User";
import { setMainWallet } from "../../store/types/Wallet";
import { Col, Row } from "antd";
import PageTitle from "../../commonComponents/PageTitle";
import WidgetStat from "./widgets/WidgetStat";
import WidgetTopSup from "./widgets/WidgetTopSup";
import WidgetTopDonat from "./widgets/WidgetTopDonat";
import WidgetLatestDonat from "./widgets/WidgetLatestDonat";
import { getUsdKoef } from "../../utils";
import "./styles.sass";

const MainContainer = () => {
  const [usdtKoef, setUsdtKoef] = useState<number>(0)

  useEffect(() => {
    getUsdKoef("evmos", setUsdtKoef);
  }, [])

  return (
    <>
      <PageTitle formatId="page_title_dashboard" />
      <Row gutter={[16, 16]} className="widgets_container">
        <Col span={14}>
          <WidgetStat usdtKoef={usdtKoef} />
          <WidgetTopSup usdtKoef={usdtKoef} />
        </Col>
        <Col span={10}>
          <WidgetLatestDonat usdtKoef={usdtKoef} />
        </Col>
        <Col span={24}>
          <WidgetTopDonat />
        </Col>
      </Row>
    </>
  );
};

export default MainContainer;
