import { useEffect } from "react";
import { IntlProvider } from "react-intl";
import { BrowserRouter } from "react-router-dom";

import { LOCALES } from "./i18n/locales";
import messages from "./i18n/messages";
import { useDispatch } from "react-redux";
import { tryToGetUser } from "./store/types/User";
import { ReactNotifications } from "react-notifications-component";

import LayoutApp from "./containers/LayoutContainer";
import { WebSocketProvider } from "./components/Websocket";
import { setMainWallet } from "./store/types/Wallet";
import { setLoading } from "./store/types/Loading";
import { walletsConf } from "./utils";

import "react-notifications-component/dist/theme.css";
import "antd/dist/antd.css";
import "./commonStyles/main.sass";

// import moment from 'moment';
// moment.locale();

function App() {
  const dispatch = useDispatch();
  const locale = LOCALES.ENGLISH;

  useEffect(() => {
    const checkWallet = async () => {
      const wallet = walletsConf[process.env.REACT_APP_WALLET || "metamask"];
      const walletData = await wallet.getWalletData(
        process.env.REACT_APP_BLOCKCHAIN
      );

      if (walletData) {
        dispatch(
          setMainWallet({
            token: walletData.address,
            wallet: process.env.REACT_APP_WALLET,
            blockchain: process.env.REACT_APP_BLOCKCHAIN,
          })
        );

        dispatch(tryToGetUser(walletData.address));
        var refreshId = setInterval(function () {
          if (wallet) {
            dispatch(tryToGetUser(walletData.address));
            clearInterval(refreshId);
          }
        }, 1000);
      } else {
        dispatch(setLoading(false));
      }
    };
    checkWallet();
    // localStorage.getItem("main_wallet");
  }, []);

  return (
    <IntlProvider
      locale="en-EN"
      defaultLocale="en-EN"
      messages={messages[locale]}
    >
      <BrowserRouter>
        <WebSocketProvider>
          <ReactNotifications />
          <LayoutApp />
        </WebSocketProvider>
      </BrowserRouter>
    </IntlProvider>
  );
}

export default App;
