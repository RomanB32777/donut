export const SET_MAIN_WALLET = 'SET_MAIN_WALLET'

export const setMainWallet = (payload: any) => {
    localStorage.setItem("main_wallet", JSON.stringify(payload));
    return ({type: SET_MAIN_WALLET, payload})
}
