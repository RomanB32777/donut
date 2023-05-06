import { defaultAssetsFolders } from 'types'
import { IDefaultImagesModal } from 'appTypes'

interface IBannerModalInfo extends IDefaultImagesModal {
	folder: defaultAssetsFolders
}

export type { IBannerModalInfo }
