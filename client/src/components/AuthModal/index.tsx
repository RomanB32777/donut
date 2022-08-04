
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import TronWalletImage from '../../assets/tronWallet'
import { closeModal } from '../../store/types/Modal'
import './styles.sass'

const AuthModal = () => {

    const dispatch = useDispatch()

    useEffect( () => {

        const clickHandler = (event: any) => {
            if (event.target.className && event.target.className.includes('auth-modal')) {
                return true
            }  else {
                dispatch(closeModal())
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
            className="auth-modal"
        >
            <span
                className="auth-modal__main-title"
            >
                Please login your Tronlink wallet
            </span>
            <span
                className="auth-modal__additional-title"
            >
                If you don’t have it, you can install by clicking the button below
            </span>
            <a
                href='https://chrome.google.com/webstore/detail/tronlink/ibnejdfjmmkpcnlpebklmnkoeoihofec'
                target="_blank"
                className="auth-modal__link"
            >
                Install Tronlink
            </a>
        </div>
    )
}

export default AuthModal