import { useEffect } from "react";
import { IntlProvider } from "react-intl";
import { BrowserRouter } from "react-router-dom";

import "./commonStyles/main.sass";
import { LOCALES } from "./i18n/locales";
import messages from "./i18n/messages";
import { useDispatch } from "react-redux";
import { tryToGetUser } from "./store/types/User";
import { ReactNotifications } from "react-notifications-component";

import "react-notifications-component/dist/theme.css";
import { WebSocketProvider } from "./components/Websocket/WebSocket";
import { setMainWallet } from "./store/types/Wallet";
import { setLoading } from "./store/types/Loading";

import "antd/dist/antd.css";
import LayoutApp from "./containers/LayoutContainer";

// import moment from 'moment';
// moment.locale();

function App() {
  const dispatch = useDispatch();
  const locale = LOCALES.ENGLISH;

  useEffect(() => {
    const walletData = localStorage.getItem("main_wallet");

    if (walletData) {
      const wallet = JSON.parse(walletData);
      dispatch(setMainWallet(wallet));

      dispatch(tryToGetUser(wallet.token));
      var refreshId = setInterval(function () {
        // var tron = getTronWallet();
        if (wallet) {
          dispatch(tryToGetUser(wallet.token));
          clearInterval(refreshId);
        }
      }, 1000);
    } else {
      dispatch(setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
