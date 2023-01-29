import { IntlProvider } from "react-intl";
import { BrowserRouter } from "react-router-dom";

import { ReactNotifications } from "react-notifications-component";
import LayoutApp from "./containers/LayoutContainer";
import { WebSocketProvider } from "./contexts/Websocket";
import { LOCALES } from "i18n/locales";
import messages from "i18n/messages";

import "react-notifications-component/dist/theme.css";
import "./commonStyles/main.sass";

function App() {
  const locale = LOCALES.ENGLISH;

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
