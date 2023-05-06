import { createContext, useEffect, useState } from 'react'
import { localesStorageKey } from 'consts'
import { LOCALES } from 'appTypes'

type ActiveAuthModalType = 'roles' | 'wallets' | 'sign' | null

interface IAppContext {
	locale: LOCALES
	activeAuthModal: ActiveAuthModalType
	handleLocale: (locale: LOCALES, isRealod?: boolean) => void
	setActiveAuthModal: (modalType: ActiveAuthModalType) => void
	// connectedWalletCb: (address: string) => any;
}

const initAppContext: IAppContext = {
	locale: LOCALES.EN,
	activeAuthModal: null,
	setActiveAuthModal: () => {
		return
	},
	handleLocale: () => {
		return
	},
	// connectedWalletCb: () => {},
}

const AppContext = createContext<IAppContext>(initAppContext)

const AppProvider = ({ children }: { children: React.ReactNode }) => {
	const [context, setContext] = useState<IAppContext>(initAppContext)

	const handleLocale = (locale: LOCALES, isReload = true) => {
		setContext((context) => ({ ...context, locale }))
		localStorage.setItem(localesStorageKey, locale)
		if (isReload) window.location.reload()
	}

	const setActiveAuthModal = (modalType: ActiveAuthModalType) => {
		setContext((context) => ({ ...context, activeAuthModal: modalType }))
	}

	useEffect(() => {
		const storageLocale = localStorage.getItem(localesStorageKey)
		storageLocale && handleLocale(storageLocale as LOCALES, false)
	}, [])

	return (
		<AppContext.Provider value={{ ...context, handleLocale, setActiveAuthModal }}>
			{children}
		</AppContext.Provider>
	)
}

export { initAppContext, AppContext, AppProvider }
