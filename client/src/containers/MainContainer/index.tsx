import { FormattedMessage } from 'react-intl'
import BlueButton from '../../commonComponents/BlueButton'
import { ChartLineIcon, LeftRightArrowsIcon, PersonCardIcon } from '../../icons/icons'
import getTronWallet from '../../functions/getTronWallet'
import postData from '../../functions/postData'
import { useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { openAuthTronModal, openRegistrationModal } from '../../store/types/Modal'
import routes from '../../routes'
import './styles.sass'

import { BlueDonut } from '../../assets/blueDonut'

const cryptoSteps = [
    {
        title: 'mainpage_crypto_steps_step_one_title',
        subtitle: 'mainpage_crypto_steps_step_one_subtitle',
    },
    {
        title: 'mainpage_crypto_steps_step_two_title',
        subtitle: 'mainpage_crypto_steps_step_two_subtitle',
    },
    {
        title: 'mainpage_crypto_steps_step_three_title',
        subtitle: 'mainpage_crypto_steps_step_three_subtitle',
    },
]

const features = [
    {
        icon: <ChartLineIcon/>,
        title: 'mainpage_feature_one_title',
        subtitle: 'mainpage_feature_one_subtitle',
    },
    {
        icon: <LeftRightArrowsIcon/>,
        title: 'mainpage_feature_two_title',
        subtitle: 'mainpage_feature_two_subtitle',
    },
    {
        icon: <PersonCardIcon/>,
        title: 'mainpage_feature_three_title',
        subtitle: 'mainpage_feature_three_subtitle',
    },
]

const MainContainer = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

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

    const user: any = useSelector((state: any) => (state.user))

    return (
        <div
            className='main-container'
        >
            <div
                className='main-container__first-mocup'
                style={{
                    height: '840px',
                }}
            >
                <div className='main-container__first-mocup__background'/>
                <div
                    className='main-container__first-mocup__title'
                >
                    <span>

                        <FormattedMessage id='mainpage_main_title' />
                    </span>
                    <BlueButton
                        formatId={
                            user && user.id && user.username && user.username.length>0
                            ?
                            'mainpage_main_button_logged'
                            :
                            'mainpage_main_button'

                        }
                        onClick={() => {
                            const wallet = getTronWallet()
                            if (user && user.id && user.username && user.username.length>0) {
                                navigate(routes.profile)
                            } else {
                                if (wallet) {
                                    checkIsExist(wallet)
                                } else {
                                    dispatch(openAuthTronModal())
                                }
                            }
                        }}
                        padding={document.body.clientWidth>640 ? '23px' : '17px'}
                        fontSize={document.body.clientWidth>640 ? '30px' : '24px'}
                    />
                </div>
            </div>

            <div
                className='main-container__video-wrapper'
                style={{
                    marginBottom: '0px'
                }}
            >

                <span>
                What is Crypto Donutz?
                </span>
                <iframe width="1120" height="630" src="https://www.youtube.com/embed/31tneq73SlY" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen={true} ></iframe>
            </div>



            <div
                className='main-container__row-panel'
            >
                <span>
                    <FormattedMessage id='mainpage_crypto_steps_title' />
                </span>
                <div>
                    {
                        cryptoSteps.map( (cryptoStep, cryptoStepIndex) => (
                            <div
                                key={'mainpage_crypto_steps_'+cryptoStepIndex}
                            >
                                <span className='icon'>
                                    {
                                        cryptoStepIndex+1
                                    }
                                </span>
                                <span className='title'>
                                    <FormattedMessage id={cryptoStep.title} />
                                </span>
                                <span className='sub-title'>
                                    <FormattedMessage id={cryptoStep.subtitle} />
                                </span>
                            </div>
                        ))
                    }
                </div>
            </div>

            <div
                className='main-container__big-mocup'
            >
                <div>
                    <FormattedMessage id='mainpage_submocup_title' />
                </div>
            </div>

            <div
                className='main-container__row-panel'
            >
                <span>
                    <FormattedMessage id='mainpage_features_title' />
                </span>
                <div>
                    {
                        features.map( (feature) => (
                            <div
                                key={'mainpage_features_'+feature.title}
                            >
                                <span className='icon' style={{marginBottom: '-12px'}}>
                                    {
                                        feature.icon
                                    }
                                </span>
                                <span className='title'>
                                    <FormattedMessage id={feature.title} />
                                </span>
                                <span className='sub-title'>
                                    <FormattedMessage id={feature.subtitle} />
                                </span>
                            </div>
                        ))
                    }
                </div>

                <div
                    className='main-container__donut-panel'
                
                >
                    
                        <BlueDonut/>
                        <div>
                            <span className='title'>
                                <FormattedMessage id='mainpage_donut_mocup_title'/>
                            </span>
                            <span className='subtitle'>
                                <FormattedMessage id='mainpage_donut_mocup_subtitle' />
                            </span>
                        </div>    
                    
                </div>

                <div
                    className='main-container__video-wrapper'
                    style={{
                        flexDirection: 'column',
                        marginBottom: '64px'
                    }}
                >
                    <span>
                        Product Walkthrough
                    </span>
                    <iframe width="1120" height="630" src="https://www.youtube.com/embed/fYYqsa102AY" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                </div>

                <div
                    className='main-container__bottom-panel'
                >
                    <div>
                        <span>
                            <FormattedMessage id='mainpage_bottom_panel_title' />
                        </span>
                        <BlueButton
                            formatId={
                                user && user.id && user.username && user.username.length>0
                                ?
                                'mainpage_main_button_logged'
                                :
                                'mainpage_bottom_panel_button'
    
                            }
                            padding={document.body.clientWidth>640 ? '22px 78px' : '12px 64px'}
                            onClick={() => {
                                const wallet = getTronWallet()
                                if (user && user.id && user.username && user.username.length>0) {
                                    navigate(routes.profile)
                                } else {
                                    if (wallet) {
                                        checkIsExist(wallet)
                                    } else {
                                        dispatch(openAuthTronModal())
                                    }
                                }
                            }}
                            fontSize={document.body.clientWidth>640 ? '30px' : '24px'}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MainContainer
