import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { WalletProvider } from "./contexts/Wallet";
import App from "./App";

import store from "./store";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <WalletProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </WalletProvider>
);
