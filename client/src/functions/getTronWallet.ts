const getTronWallet = () => {
    if ((window as any).tronWeb && (window as any).tronWeb.defaultAddress.base58) {
        return (window as any).tronWeb.defaultAddress.base58
    } else {
        return null
    } 
}

export const tronWalletIsIntall = () => (window as any).hasOwnProperty('tronWeb')

export default getTronWallet