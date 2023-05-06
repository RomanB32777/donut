import { initAuthToken, initWebToken } from 'consts'

export const scrollToPosition = (top = 0) => {
	try {
		window.scroll({
			top: top,
			left: 0,
			behavior: 'smooth',
		})
	} catch (_) {
		window.scrollTo(0, top)
	}
}

export const isValidateFilledForm = (valuesArray: any[]) => valuesArray.every((val) => Boolean(val))

export const delay = ({ ms, cb }: { ms: number; cb: (params?: any) => any }) =>
	new Promise<void>((resolve) => {
		setTimeout(() => {
			cb()
			resolve()
		}, ms)
	})

export const formatNumber = (num: string | number, fraction = 2) => {
	const inNumberType = +num
	return Number.isInteger(inNumberType) ? inNumberType : inNumberType.toFixed(fraction)
}

export const getKeyFromObject = <T, K extends keyof T>(obj: T, key: K): K => key

// auth token
export const getAuthTokenKey = () => {
	return getKeyFromObject(initAuthToken, 'access_token')
}

export const setAuthToken = (token: string) => {
	return localStorage.setItem(getAuthTokenKey(), token)
}

export const getAuthToken = () => localStorage.getItem(getAuthTokenKey())

export const removeAuthToken = () => localStorage.removeItem(getAuthTokenKey())

// web token
export const getWebTokenKey = () => getKeyFromObject(initWebToken, 'web_token')

export const getWebToken = () => localStorage.getItem(getWebTokenKey())

export const setWebToken = (token: string) => {
	return localStorage.setItem(getWebTokenKey(), token)
}

export const removeWebToken = () => localStorage.removeItem(getWebTokenKey())
