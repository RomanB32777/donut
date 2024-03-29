import axios from 'axios'
import FontFaceObserver from 'fontfaceobserver'
import { IFont } from 'appTypes'
import { ISelectItem } from 'components/SelectInput'

export const getFontsList = async () => {
	try {
		const { data } = await axios.get(
			`https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=${process.env.REACT_APP_GOOGLE_API_KEY}`
		)
		if (data.items) {
			const resultList: ISelectItem[] = data.items
				.filter((font: any) => Boolean(font.files.regular))
				.map((font: any) => ({
					key: font.files.regular.replace('http', 'https'),
					value: font.family,
				}))

			return resultList || []
		}
		return []
	} catch (error) {
		console.log(error)
		return []
	}
}

export const checkFontObserver = async (name: string) => {
	try {
		const checkFontObserver = new FontFaceObserver(name)
		const loadedFont = await checkFontObserver.load(null, 1)
		return Boolean(loadedFont)
	} catch (error) {
		console.log(error)
		return false
	}
}

export const loadFont = async ({ name, link }: IFont) => {
	if (!link) return null
	try {
		const isLoaded = await checkFontObserver(name)
		if (!isLoaded) {
			const newFont = new FontFace(name, `url(${link})`, {
				style: 'normal',
				weight: '400',
			})
			const loadedFont = await newFont.load()
			document.fonts.add(loadedFont)
			return loadedFont
		}
		return null
	} catch (error) {
		console.log(error)
		return null
	}
}

export const loadFonts = async <T extends Record<string, string>>({
	fields,
	fonts,
}: {
	fields: T
	fonts: ISelectItem[]
}) => {
	const result = await Promise.all(
		Object.keys(fields).map(async (key) => {
			const fontInfo = {
				name: fields[key],
				link: fonts.find((f) => f.value === fields[key])?.key || '',
			}
			await loadFont(fontInfo)
			return { key, fontInfo }
		})
	)

	return result.reduce(
		(acc, { key, fontInfo }) => ({ ...acc, [key]: fontInfo }),
		{} as Record<keyof T, IFont>
	)
}

export const getFontColorStyles = (color: string, font: IFont) => ({
	color,
	fontFamily: `"${font.name}", sans-serif`,
})
