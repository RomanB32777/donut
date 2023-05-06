import { Buffer } from 'buffer'
import { FormattedMessage } from 'react-intl'
import { addNotification } from '../notifications'
import { formatNumber } from 'utils/appMethods'
import { IReplaceObj } from './types'
import { IRenderStatItemData } from 'appTypes'

export const getRandomStr = (length: number) => {
	let result = ''
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	const charactersLength = characters.length
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength))
	}
	return result
}

export const shortStr = (str: string, length: number) => {
	return str.length > 30 ? str.slice(0, 6) + '...' + str.slice(str.length - length) : str
}

export const copyStr = ({ str, copyObject }: { str: string; copyObject: string }) => {
	try {
		navigator.clipboard.writeText(str)
		const formatCopyObject = copyObject[0].toUpperCase() + copyObject.slice(1)
		addNotification({
			type: 'success',
			title: <FormattedMessage id="copy_message_successfully" values={{ formatCopyObject }} />,
		})
	} catch (error) {
		addNotification({
			type: 'warning',
			title: (
				<FormattedMessage
					id="copy_message_error"
					values={{ copyObject: copyObject.toLowerCase() }}
				/>
			),
		})
	}
}

export const renderStrWithTokens = (template: string | string[], replaceObj: IReplaceObj[]) => {
	const str = Array.isArray(template) ? template.join(' ') : template
	return replaceObj.reduce((acc, { re, to }) => {
		return acc.replace(re, to)
	}, str)
}

export const renderStatItem = (template: string | string[], objToRender: IRenderStatItemData) => {
	return renderStrWithTokens(template, [
		{
			re: /{username}/gi,
			to: objToRender?.username ?? objToRender?.backer?.username ?? '',
		},
		{
			re: /{sum}/gi,
			to: `${formatNumber(objToRender?.sumUsd ?? objToRender?.sum)} USD`,
		},
		{
			re: /{message}/gi,
			to: objToRender?.message ?? '',
		},
	])
}

export const fromHexToString = (strHex: string) => {
	const bufferFormat = Buffer.from(strHex, 'hex')
	if (bufferFormat) return bufferFormat.toString('utf8')
	else return strHex
}
