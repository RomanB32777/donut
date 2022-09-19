import React, { useEffect } from "react";
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
          {/* <div className="container">
            <Navbar />
            <Routes>
              {user && user.id && (
                <>
                  <Route path={routes.profile} element={<ProfilePage />} />
                  <Route
                    path={routes.createNewBadge}
                    element={<NewBadgePage />}
                  />
                  <Route path={routes.badges} element={<BadgesPage />} />
                  <Route
                    path={routes.notifications}
                    element={<NotificationsPage />}
                  />
                  <Route
                    path={routes.supporters}
                    element={<SupportersPage />}
                  />
                  <Route path={routes.nft} element={<NftPage />} />
                  <Route path={routes.createNft} element={<NewNftPage />} />
                  <Route path={routes.creator} element={<PersonInfoPage />} />
                  <Route path={routes.followers} element={<FollowersPage />} />
                  <Route path={routes.following} element={<FollowsPage />} />
                </>
              )}
              <Route
                path={routes.transactions}
                element={<TransactionsPage />}
              />
              <Route path={routes.main} element={<MainPage />} />
              <Route path={routes.creator} element={<PersonInfoPage />} />
              <Route path={routes.creators} element={<CreatorsListPage />} />
              <Route path={routes.backers} element={<BackersPage />} />
              <Route path={routes.donat} element={<DonatPage />} />
              <Route path={routes.donatMessage} element={<DonatMessagePage />} />
            </Routes>
            <Footer />
            {modal && modal.length > 0 && (
              <div className="modal-wrapper">
                {modal === OPEN_AUTH_TRON_MODAL && (
                  <AuthModal wallet="Tronlink" />
                )}
                {modal === OPEN_AUTH_METAMASK_MODAL && (
                  <AuthModal wallet="Metamask" />
                )}
                {modal === OPEN_AUTH_WALLETS_MODAL && (
                  <AuthModal wallet="all" />
                )}
                {modal === OPEN_REGISTRATION_MODAL && <RegistrationModal />}
                {modal === OPEN_SUPPORT_MODAL && <SupportModal />}
              </div>
            )}
          </div> */}
        </WebSocketProvider>
      </BrowserRouter>
    </IntlProvider>
  );
}

export default App;
