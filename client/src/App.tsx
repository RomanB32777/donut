import React, { useEffect } from 'react';
import { IntlProvider } from 'react-intl';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './commonComponents/Navbar';

import './commonStyles/main.sass'
//import PersonInfoContainer from './containers/PersonInfoContainer';
import { LOCALES } from './i18n/locales';
import messages from './i18n/messages';
import routes from './routes';

import ProfilePage from './pages/ProfilePage'
import NewBadgePage from './pages/NewBadgePage';
import MainPage from './pages/MainPage';
import BadgesPage from './pages/BadgesPage';
import PersonInfoPage from './pages/PersonInfoPage';
import { useDispatch, useSelector } from 'react-redux';
import { OPEN_AUTH_TRON_MODAL, OPEN_REGISTRATION_MODAL, OPEN_SUPPORT_MODAL } from './store/types/Modal';
import AuthModal from './components/AuthModal';
import RegistrationModal from './components/RegistrationModal';
import SupportModal from './components/SupportModal';
import getTronWallet from './functions/getTronWallet';
import { tryToGetUser } from './store/types/User';
import NftPage from './pages/NftPage';
import NewNftPage from './pages/NewNftPage';
import SupportersPage from './pages/SupportersPage';
import CreatorsListPage from './pages/CreatorsListPage';
import BackersPage from './pages/BackersPage';
import FollowersPage from './pages/FollowersPage';
import FollowsPage from './pages/FollowsPage';
import TransactionsPage from './pages/TransactionsPage';
import Footer from './commonComponents/Footer';
import PlugContainer from './containers/PlugContainer';

function App() {

  const dispatch = useDispatch()

  const locale = LOCALES.ENGLISH

  const modal = useSelector( (state: any) => (state.modal))
  const tron_token = getTronWallet()

  const user = useSelector( (state: any) => (state.user))

  useEffect( () => {
      if (tron_token) {
        dispatch( tryToGetUser(tron_token) )
      }
      var refreshId = setInterval(function() {
        var tron = getTronWallet()
        if (tron) {
          dispatch( tryToGetUser(tron) )
          clearInterval(refreshId)
        }
      }, 1000)
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <IntlProvider locale='en-EN' defaultLocale='en-EN' messages={messages[locale]}>
      <BrowserRouter>

<div className='container'>
          <Navbar/>
          <Routes>
            {
              (user && user.id)
              &&
              <>
                <Route path={routes.profile} element={<ProfilePage/>} />
                <Route path={routes.createNewBadge} element={<NewBadgePage/>} />
                <Route path={routes.badges} element={<BadgesPage/>} />
                <Route path={routes.supporters} element={<SupportersPage/>} />
                <Route path={routes.nft} element={<NftPage/>} />
                <Route path={routes.createNft} element={<NewNftPage/>} />
                <Route path={routes.creator} element={<PersonInfoPage/>} />
                <Route path={routes.followers} element={<FollowersPage/>} />
                <Route path={routes.following} element={<FollowsPage/>} />
              </>
            }
            <Route path={routes.transactions} element={<TransactionsPage/>} />
            <Route path={routes.main} element={<MainPage/>} />
            <Route path={routes.creator} element={<PersonInfoPage/>} />
            <Route path={routes.creators} element={<CreatorsListPage/>} />
            <Route path={routes.backers} element={<BackersPage/>} />

          </Routes>
          <Footer/>
          {
            modal && modal.length>0
            &&
            <div className='modal-wrapper'>
              {
                modal === OPEN_AUTH_TRON_MODAL
                &&
                <AuthModal/>
              }
              {
                modal === OPEN_REGISTRATION_MODAL
                &&
                <RegistrationModal/>
              }
              {
                modal === OPEN_SUPPORT_MODAL
                &&
                <SupportModal/>
              }
            </div>
          }
        </div>

        

      
      </BrowserRouter>
    </IntlProvider>
  )
}

export default App;
