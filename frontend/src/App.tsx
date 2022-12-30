import { useContext, useEffect } from "react";
import { IntlProvider } from "react-intl";
import { BrowserRouter } from "react-router-dom";

import { LOCALES } from "./i18n/locales";
import messages from "./i18n/messages";
import { useDispatch } from "react-redux";
import { WalletContext } from "./contexts/Wallet";
import { tryToGetUser } from "./store/types/User";
import { ReactNotifications } from "react-notifications-component";

import LayoutApp from "./containers/LayoutContainer";
import { WebSocketProvider } from "./components/Websocket";
import { setSelectedBlockchain } from "./store/types/Wallet";
import { setLoading } from "./store/types/Loading";

import "react-notifications-component/dist/theme.css";
import "antd/dist/antd.css";
import "./commonStyles/main.sass";

function App() {
  const dispatch = useDispatch();
  const locale = LOCALES.ENGLISH;

  const { walletConf } = useContext(WalletContext);

  useEffect(() => {
    const checkWallet = async () => {
      const blockchainData = await walletConf.getBlockchainData();
      const currentBlockchain = await walletConf.getCurrentBlockchain();

      if (blockchainData && currentBlockchain) {
        dispatch(setSelectedBlockchain(currentBlockchain.name));
        dispatch(tryToGetUser(blockchainData.address));
      } else {
        dispatch(setLoading(false));
      }
    };
    checkWallet();
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
