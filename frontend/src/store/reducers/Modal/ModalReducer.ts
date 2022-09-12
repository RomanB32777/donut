import { CLOSE_MODAL, OPEN_AUTH_METAMASK_MODAL, OPEN_AUTH_TRON_MODAL, OPEN_AUTH_WALLETS_MODAL, OPEN_REGISTRATION_MODAL, OPEN_SUPPORT_MODAL } from "../../types/Modal"

const initialState: string = ''

const ModalReducer = (state = initialState, action: any) => {
    switch (action.type) {

        case OPEN_AUTH_TRON_MODAL:
            return OPEN_AUTH_TRON_MODAL

        case OPEN_AUTH_METAMASK_MODAL:
            return OPEN_AUTH_METAMASK_MODAL

        case OPEN_AUTH_WALLETS_MODAL:
            return OPEN_AUTH_WALLETS_MODAL          

        case OPEN_REGISTRATION_MODAL:
            return OPEN_REGISTRATION_MODAL

        case OPEN_SUPPORT_MODAL:
            return OPEN_SUPPORT_MODAL

        case CLOSE_MODAL:
            return ''

        default:
            return state
    }
}

export default ModalReducer