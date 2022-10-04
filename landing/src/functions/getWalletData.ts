export const isInstallMetamaskWallet = () => (window as any).hasOwnProperty('ethereum')
export const isInstallTronWallet = () => (window as any).hasOwnProperty('tronWeb')