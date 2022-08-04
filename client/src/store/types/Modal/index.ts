export const OPEN_AUTH_TRON_MODAL = 'OPEN_AUTH_TRON_MODAL'
export const OPEN_REGISTRATION_MODAL = 'OPEN_REGISTRATION_MODAL'
export const OPEN_SUPPORT_MODAL = 'OPEN_SUPPORT_MODAL'

export const CLOSE_MODAL = 'CLOSE_MODAL'

//actions
export const openAuthTronModal = () => ({type: OPEN_AUTH_TRON_MODAL})
export const openRegistrationModal = () => ({type: OPEN_REGISTRATION_MODAL})
export const openSupportModal = () => ({type: OPEN_SUPPORT_MODAL})

export const closeModal = () => ({type: CLOSE_MODAL})