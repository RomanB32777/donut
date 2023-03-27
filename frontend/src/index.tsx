import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import { AppProvider } from "contexts/AppContext";
import App from "./App";

import store from "./store";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <AppProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </AppProvider>
);
