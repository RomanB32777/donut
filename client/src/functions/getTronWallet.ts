const getTronWallet = () => {
    if ((window as any).tronWeb && (window as any).tronWeb.defaultAddress.base58) {
        return (window as any).tronWeb.defaultAddress.base58
    } else {
        return null
    } 
}

export const getMetamaskWallet = async () => {
    if ((window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length === 0) {
            console.log('Please connect to MetaMask.');
            return null;
        } else return accounts[0]
    } else {
        return null
    } 
}

export const tronWalletIsIntall = () => (window as any).hasOwnProperty('tronWeb')

export const metamaskWalletIsIntall = () => (window as any).hasOwnProperty('ethereum')

export default getTronWallet