
import { AccountCircleIcon, DonutIcon, WalletIcon } from '../../icons/icons'
import './styles.sass'

import LogoIcon from '../../icons/LogoIcon'
import Search from '../../components/Search'
import { useDispatch, useSelector } from 'react-redux'
import getTronWallet from '../../functions/getTronWallet'
import { useNavigate } from 'react-router'
import routes from '../../routes'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { url } from '../../consts'
import { setUser } from '../../store/types/User'
import { openAuthTronModal, openRegistrationModal } from '../../store/types/Modal'
import postData from '../../functions/postData'

const Navbar = () => {
    
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const user = useSelector( (state: any) => (state.user))


    const checkIsExist = async (token: string) => {

        postData('/api/user/check-user-exist/', { tron_token: token })
        .then(data => {
            if (data.notExist) {
                dispatch(openRegistrationModal())
            } else {
                navigate(routes.profile)
            }
        });

    }

    const [isProfilePopupOpened, setProfilePopupOpened] = useState<boolean>(false)

    const popupTitles = 
        user.roleplay==='creators'
        ?
        [
            {
                title: 'My profile',
                link: '/creator/'+user.username
            },
            {
                title: 'Account',
                link: routes.profile
            },
            {
                title: 'Collections',
                link: routes.nft
            },
            {
                title: 'Supporters',
                link: routes.supporters
            },
            {
                title: 'Badges',
                link: routes.badges
            },
            {
                title: 'Followers',
                link: routes.followers
            },
            {
                title: 'Sign out',
                link: routes.main
            },
        ]
        :
        [
            {
                title: 'Account',
                link: routes.profile
            },
            {
                title: 'Transactions',
                link: routes.transactions
            },
            {
                title: 'Badges',
                link: routes.badges
            },
            {
                title: 'Following',
                link: routes.following
            },
            {
                title: 'Sign out',
                link: routes.main
            },
        ]

    useEffect( () => {

        const clickHandler = (event: any) => {
            if (event.target && event.target.className && event.target.className.includes('profile-popup') ) {
                return true
            } else {
                setProfilePopupOpened(false)
            }
        }

        document.addEventListener('click', clickHandler)

        return () => {
            document.removeEventListener('click', clickHandler)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div
            className="navbar-wrapper"
        >
            <div
                className='navbar'
            >

                <div
                    className='navbar__left-side'
                >
                    <div
                        onClick={() => navigate(routes.main)}
                        style={{
                            cursor: 'pointer'
                        }}
                    >
                        <LogoIcon/>
                    </div>

                    <div
                        className='navbar__left-side__submenu'
                    >
                        <Link to={routes.creators}>
                            Creators
                        </Link>
                        <Link to={routes.backers}>
                            Supporters
                        </Link>
                    </div>
                    
                    <div>
                        <Search />
                    </div>
                </div>

                

                <div
                    className='navbar__right-side'
                >   
                    {
                        user && user.roleplay && user.roleplay === 'creators'
                        &&
                        <div
                            onClick={() => {
                                if (user.roleplay === 'creators') {
                                    navigate(routes.supporters)
                                }
                            }}
                            className='donut'
                        >
                            <DonutIcon/>
                        </div>
                    }
                    <div onClick={() => {
                        const wallet = getTronWallet()
                        if (user && user.id) {
                            setProfilePopupOpened(true)
                        } else {
                            if (wallet) {
                                checkIsExist(wallet)
                            } else {
                                dispatch(openAuthTronModal())
                            }
                        }
                        
                    }}
                        className='icon'
                    >
                        <AccountCircleIcon/>
                    </div>
                </div>

                {
                    isProfilePopupOpened && user.id
                    &&
                    <div
                        className='profile-popup-wrapper'
                        style={{
                            height: user.roleplay==='creators' ? '395px' : '305px',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >   

                        <div
                            className='profile-popup__header'
                        >
                            <div
                                className='profile-popup__header__image'
                            >
                                {
                                    user.avatarlink && user.avatarlink.length>0
                                    ?
                                    <img src={ url + user.avatarlink } />
                                    :
                                    <></>
                                }
                            </div>
                            <div
                                className='profile-popup__header__info'
                            >   
                                <span
                                    className='profile-popup__header__info__name'
                                >
                                    {
                                        user.person_name && user.person_name.length>0
                                        ?
                                        user.person_name
                                        :
                                        <>Person Name</>
                                    }
                                </span>
                                <span
                                    className='profile-popup__header__info__username'
                                >
                                    {   
                                        user.username
                                    }
                                </span>
                            </div>
                        </div>

                        <div
                            className='profile-popup__main'
                        >
                            {
                                popupTitles.map( (title, index) => (
                                    <div
                                        key={'profile-popup__link'+index}
                                        className='profile-popup__main__link'
                                        style={{
                                            borderBottom: index===popupTitles.length-1 ? 'none' : '1px solid #000000'
                                        }}
                                        onClick={() => {
                                            if (title.title === 'Sign out') {
                                                dispatch(setUser(''))
                                            }
                                            navigate(title.link)
                                        }}
                                    >
                                        {
                                            title.title
                                        }
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Navbar