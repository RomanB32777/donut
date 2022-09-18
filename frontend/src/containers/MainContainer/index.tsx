import getTronWallet, {
  getMetamaskWallet,
  metamaskWalletIsIntall,
  tronWalletIsIntall,
} from "../../functions/getTronWallet";
import postData from "../../functions/postData";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  openAuthTronModal,
  openAuthWalletsModal,
  openRegistrationModal,
} from "../../store/types/Modal";
import routes from "../../routes";
import { tryToGetUser } from "../../store/types/User";
import { setMainWallet } from "../../store/types/Wallet";
import { Col, Row } from "antd";
import PageTitle from "../../commonComponents/PageTitle";
import WidgetStat from "./widgets/WidgetStat";
import WidgetTopSup from "./widgets/WidgetTopSup";
import WidgetTopDonat from "./widgets/WidgetTopDonat";
import WidgetLatestDonat from "./widgets/WidgetLatestDonat";
import "./styles.sass";

const MainContainer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const checkIsExist = async (token: string) => {
    postData("/api/user/check-user-exist/", { token }).then((data) => {
      if (data.notExist) {
        dispatch(openRegistrationModal());
      } else {
        dispatch(tryToGetUser(token));
        navigate(routes.profile);
      }
    });
  };

  const user: any = useSelector((state: any) => state.user);

  const signUp = async () => {
    if (tronWalletIsIntall() && metamaskWalletIsIntall() && !user.id) {
      dispatch(openAuthWalletsModal());
    } else if (tronWalletIsIntall() || metamaskWalletIsIntall()) {
      let wallet = {
        token: "",
        wallet: "",
      };
      if (tronWalletIsIntall()) {
        wallet = {
          wallet: "tron",
          token: getTronWallet(),
        };
      } else if (metamaskWalletIsIntall()) {
        const tokenMeta = await getMetamaskWallet();
        wallet = {
          wallet: "metamask",
          token: tokenMeta,
        };
      }
      if (user && user.id) {
        navigate(routes.profile);
      } else {
        if (wallet.token) {
          checkIsExist(wallet.token);
          dispatch(setMainWallet(wallet));
          localStorage.setItem("main_wallet", JSON.stringify(wallet));
        } else {
          dispatch(openRegistrationModal());
        }
      }
    } else {
      dispatch(openAuthWalletsModal());
    }
  };

  return (
    <>
      <PageTitle formatId="page_title_dashboard" />
      <Row gutter={[16, 16]} className="widgets_container">
        <Col span={14}>
          <WidgetStat />
          <WidgetTopSup />
        </Col>
        <Col span={10}>
          <WidgetLatestDonat />
        </Col>
        <Col span={24}>
          <WidgetTopDonat />
        </Col>
      </Row>
    </>
  );
};

export default MainContainer;
