import { bannerTypes, donatAssetTypes } from 'types'
import { IDefaultImagesModal } from 'appTypes'

export interface ModalImagesInfo {
	colImage: number
	bannerType: bannerTypes
}

export interface IBannerModalInfo extends IDefaultImagesModal, ModalImagesInfo {
	folder: donatAssetTypes
}
