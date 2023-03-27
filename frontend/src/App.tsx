import { useContext, useEffect } from "react";
import { IntlProvider } from "react-intl";
import { WagmiConfig } from "wagmi";
import { BrowserRouter } from "react-router-dom";

import { ReactNotifications } from "react-notifications-component";
import LayoutApp from "containers/LayoutContainer";
import { AppContext } from "contexts/AppContext";
import { WebSocketProvider } from "contexts/Websocket";
import { useLazyGetLocationQuery } from "store/services/UserService";
import { client } from "utils/wallets/wagmi";
import messages from "i18n/messages";
import { LOCALES } from "appTypes";

import "react-notifications-component/dist/theme.css";
import "./commonStyles/main.sass";

const App = () => {
  const { locale, handleLocale } = useContext(AppContext);
  const [getLocation] = useLazyGetLocationQuery();

  useEffect(() => {
    const getUserLocation = async () => {
      const { data } = await getLocation();
      // handleLocale
      console.log(data);
    };

    getUserLocation();
  }, []);

  return (
    <IntlProvider
      locale={locale}
      defaultLocale={LOCALES.EN}
      messages={messages[locale]}
    >
      <WagmiConfig client={client}>
        <BrowserRouter>
          <WebSocketProvider>
            <ReactNotifications />
            <LayoutApp />
          </WebSocketProvider>
        </BrowserRouter>
      </WagmiConfig>
    </IntlProvider>
  );
};

export default App;
