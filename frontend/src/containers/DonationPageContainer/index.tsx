import { Col, Row, QRCode } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import { FormattedMessage } from 'react-intl'
import FileSaver from 'file-saver'
import { BannerTypes, donatAssetTypes } from 'types'

import BaseButton from 'components/BaseButton'
import PageTitle from 'components/PageTitle'
import ColorPicker from 'components/ColorPicker'
import LinkCopy from 'components/LinkCopy'
import UploadImage, { UploadAfterEl } from 'components/UploadImage'
import FormInput from 'components/FormInput'
import ModalComponent from 'components/ModalComponent'
import FormBtnsBlock from 'components/FormBtnsBlock'
import VideoBlock from 'components/video-block/video-block'
import { SmallToggleListArrowIcon } from 'icons'

import { useAppSelector } from 'hooks/reduxHooks'
import useWindowDimensions from 'hooks/useWindowDimensions'
import { useEditCreatorMutation } from 'store/services/UserService'
import { useLazyGetDefaultImagesQuery } from 'store/services/FilesService'
import { RoutePaths, initDonatPage, baseURL } from 'consts'
import { IDonatPageWithFiles, DonatePageFields } from 'appTypes'
import { IBannerModalInfo, ModalImagesInfo } from './types'
import './styles.sass'

const modalImageInfo: Record<donatAssetTypes, ModalImagesInfo> = {
	background: {
		colImage: 8,
		bannerType: 'backgroundBanner',
	},
	header: {
		colImage: 24,
		bannerType: 'headerBanner',
	},
	twitch: {
		colImage: 12,
		bannerType: 'twitchBanner',
	},
}

const videoLink = 'https://www.youtube.com/embed/JlWaN-uwXfY'

const DonationPageContainer = () => {
	const [editCreator, { isLoading: isEditCreatorLoading }] = useEditCreatorMutation()
	const [getDefaultImages] = useLazyGetDefaultImagesQuery()
	const user = useAppSelector(({ user }) => user)

	const [donationInfoData, setDonationInfoData] = useState<IDonatPageWithFiles>(initDonatPage)
	const [isOpenQR, setIsOpenQR] = useState(false)
	const [isOpenTwitch, setIsOpenTwitch] = useState(false)
	const [bannerModalInfo, setBannerModalInfo] = useState<IBannerModalInfo>({
		images: [],
		folder: 'background',
		isOpen: false,
		colImage: 8,
		bannerType: 'backgroundBanner',
	})
	const { isMobile } = useWindowDimensions()

	const { id, username, creator } = user

	const qrHandler = () => setIsOpenQR((prev) => !prev)
	const twitchHandler = () => setIsOpenTwitch((prev) => !prev)

	const formElementsHandler = useCallback(
		<T,>(field: DonatePageFields) =>
			(value: T) =>
				setDonationInfoData((form) => ({ ...form, [field]: value })),
		[]
	)

	const openBannersPopup = async (folder: donatAssetTypes) => {
		const { data: images } = await getDefaultImages(folder)
		if (images) {
			setBannerModalInfo({
				images,
				folder,
				isOpen: true,
				...modalImageInfo[folder],
			})
		}
	}

	const closeBannersPopup = () => setBannerModalInfo((prev) => ({ ...prev, isOpen: false }))

	const selectDefaultBanner = (image: string) => async () => {
		const imageType = modalImageInfo[folder].bannerType
		setDonationInfoData({
			...donationInfoData,
			[imageType]: {
				file: null,
				preview: image,
			},
		})
		if (folder === 'twitch') {
			const [editArgs]: Parameters<typeof editCreator> = [{ twitchBanner: image }]
			await editCreator(editArgs)
		}
		closeBannersPopup()
	}

	const onQrDownload = () => {
		const canvas = document.querySelector('.QRCode')?.querySelector<HTMLCanvasElement>('canvas')
		if (canvas) {
			const url = canvas.toDataURL()
			const a = document.createElement('a')
			a.download = 'QRCode.png'
			a.href = url
			document.body.appendChild(a)
			a.click()
			document.body.removeChild(a)
		}
	}

	const onImageDownload = () => {
		const {
			twitchBanner: { preview },
		} = donationInfoData
		if (preview) FileSaver.saveAs(preview, 'twitchBanner.png')
	}

	const sendData = (isReset?: boolean) => async () => {
		if (creator) {
			if (isReset) {
				await editCreator({ isReset })
			} else {
				const changedField = Object.keys(donationInfoData).filter((field) => {
					const key = field as DonatePageFields
					return donationInfoData[key] !== creator[key]
				})

				if (changedField.length) {
					const changedCreatorInfo = changedField.reduce(
						(obj, field) => ({
							...obj,
							[field]: donationInfoData[field as DonatePageFields],
						}),
						{} as Partial<IDonatPageWithFiles>
					)

					const { headerBanner, backgroundBanner, twitchBanner, ...donatPageInfo } =
						changedCreatorInfo

					const [editArgs]: Parameters<typeof editCreator> = [donatPageInfo]

					// TODO
					if (twitchBanner) {
						const { preview } = twitchBanner
						editArgs.twitchBanner = preview
					}

					// TODO
					if (headerBanner) {
						const { file, preview } = headerBanner
						if (file) editArgs.header = file
						else editArgs.headerBanner = preview
					}

					// TODO
					if (backgroundBanner) {
						const { file, preview } = backgroundBanner
						if (file) editArgs.background = file
						else editArgs.backgroundBanner = preview
					}
					await editCreator(editArgs)
				}
			}
		}
	}

	const resetData = sendData(true)

	useEffect(() => {
		if (id && creator) {
			const {
				headerBanner,
				backgroundBanner,
				twitchBanner,
				welcomeText,
				btnText,
				mainColor,
				backgroundColor,
			} = creator

			setDonationInfoData((prevInfo) => ({
				...prevInfo,
				headerBanner: {
					preview: headerBanner || '',
					file: prevInfo.headerBanner.file,
				},
				backgroundBanner: {
					preview: backgroundBanner || '',
					file: prevInfo.backgroundBanner.file,
				},
				twitchBanner: {
					preview: twitchBanner || '',
					file: null,
				},
				welcomeText,
				btnText,
				mainColor,
				backgroundColor,
			}))
		}
	}, [id, creator])

	const linkForSupport = useMemo(() => `${baseURL}/${RoutePaths.support}/${username}`, [username])

	const {
		headerBanner,
		backgroundBanner,
		twitchBanner,
		welcomeText,
		btnText,
		mainColor,
		backgroundColor,
	} = donationInfoData

	const { isOpen, folder, images } = bannerModalInfo

	return (
		<div className="donationPage-container fadeIn">
			<PageTitle formatId="page_title_donation_page" />
			<div className="link-top">
				<p>
					<FormattedMessage id="donation_subtitle" />
				</p>
				<LinkCopy link={linkForSupport} isSimple={!isMobile} />
			</div>
			<VideoBlock link={videoLink} />
			<Row>
				<Col md={12} xs={24}>
					<div className="downloadBlock">
						<div className="downloadTitle" onClick={qrHandler}>
							<span>
								<FormattedMessage id="donation_generate_button" />
							</span>
							<div
								className={clsx('icon', {
									rotated: isOpenQR,
								})}
							>
								<SmallToggleListArrowIcon />
							</div>
						</div>
						{isOpenQR && (
							<div className="downloadWrapper fadeIn">
								<div className="imageBlock">
									<QRCode
										errorLevel="H"
										className="QRCode"
										value={linkForSupport}
										bordered={false}
										// icon={avatar}
									/>
								</div>
								<BaseButton
									formatId="donation_download_button"
									padding="6px 26px"
									onClick={onQrDownload}
									fontSize="18px"
									isMain
								/>
							</div>
						)}
					</div>
				</Col>
				<Col md={12} xs={24}>
					<div className="downloadBlock">
						<div className="downloadTitle" onClick={twitchHandler}>
							<span>
								<FormattedMessage id="donation_twitch_button" />
							</span>
							<div
								className={clsx('icon', {
									rotated: isOpenTwitch,
								})}
							>
								<SmallToggleListArrowIcon />
							</div>
						</div>
						{isOpenTwitch && (
							<div className="downloadWrapper fadeIn">
								<div className="imageBlock">
									<div className="twitch" onClick={() => openBannersPopup('twitch')}>
										<img src={twitchBanner.preview} alt="Twitch banner" />
									</div>
								</div>
								<BaseButton
									formatId="donation_download_button"
									padding="6px 26px"
									onClick={onImageDownload}
									fontSize="18px"
									isMain
								/>
							</div>
						)}
					</div>
				</Col>
			</Row>

			<div className="designSettings">
				<PageTitle formatId="page_title_design" />
				<Row gutter={[0, 18]} className="form">
					<Col span={24}>
						<div className="form-element">
							<UploadImage
								label={<FormattedMessage id="donation_header_banner" />}
								formats={['PNG', 'JPG', 'JPEG']}
								filePreview={headerBanner.preview}
								setFile={formElementsHandler(BannerTypes.headerBanner)}
								afterEl={
									<UploadAfterEl
										size="1200*800"
										mdCol={6}
										alsoText={<FormattedMessage id="upload_choose_banners" />}
										openBanners={() => openBannersPopup('header')}
									/>
								}
								labelCol={6}
								inputCol={10}
								isBanner
								isWithClearIcon
							/>
						</div>
					</Col>

					<Col span={24}>
						<div className="form-element">
							<UploadImage
								label={<FormattedMessage id="donation_background_banner" />}
								formats={['PNG', 'JPG', 'JPEG']}
								filePreview={backgroundBanner.preview}
								setFile={formElementsHandler(BannerTypes.backgroundBanner)}
								afterEl={
									<UploadAfterEl
										size="1200*800"
										mdCol={6}
										alsoText={<FormattedMessage id="upload_choose_banners" />}
										openBanners={() => openBannersPopup('background')}
									/>
								}
								labelCol={6}
								inputCol={10}
								isBanner
								isWithClearIcon
							/>
						</div>
					</Col>
					<Col span={24}>
						<div className="form-element">
							<FormInput
								label={<FormattedMessage id="donation_welcome_text" />}
								name="welcomeText"
								value={welcomeText}
								setValue={formElementsHandler('welcomeText')}
								labelCol={7}
								inputCol={10}
								gutter={[0, 16]}
								isTextarea
							/>
						</div>
					</Col>
					<Col span={24}>
						<div className="form-element">
							<FormInput
								label={<FormattedMessage id="donation_button_text" />}
								name="buttonText"
								value={btnText}
								setValue={formElementsHandler('btnText')}
								labelCol={7}
								inputCol={10}
								gutter={[0, 16]}
							/>
						</div>
					</Col>
					<Col span={24}>
						<div className="form-element">
							<ColorPicker
								name="donation_main_color"
								color={mainColor}
								label={<FormattedMessage id="donation_main_color" />}
								setColor={formElementsHandler('mainColor')}
								labelCol={7}
								gutter={[0, 16]}
							/>
						</div>
					</Col>
					<Col span={24}>
						<div className="form-element">
							<ColorPicker
								name="donation_background_color"
								color={backgroundColor}
								label={<FormattedMessage id="donation_background_color" />}
								setColor={formElementsHandler('backgroundColor')}
								labelCol={7}
								gutter={[0, 16]}
							/>
						</div>
					</Col>
				</Row>
				<FormBtnsBlock
					saveMethod={sendData()}
					resetMethod={resetData}
					disabled={isEditCreatorLoading}
				/>
			</div>
			<ModalComponent
				open={isOpen}
				title={<FormattedMessage id="donation_default_banners" values={{ bannerType: folder }} />}
				width={900}
				onCancel={closeBannersPopup}
				className="donat-modal"
				topModal
			>
				<Row gutter={[16, 32]} justify="space-between">
					{images.map(({ name, path }, key) => (
						<Col md={modalImageInfo[folder].colImage} key={`banner-${name}-${key}`}>
							<div
								className={clsx('default-banner', {
									long: folder !== 'background',
								})}
								onClick={selectDefaultBanner(path)}
							>
								<img
									src={path}
									alt={`banner-${key}`}
									style={{ objectFit: folder === 'twitch' ? 'contain' : 'cover' }}
								/>
							</div>
						</Col>
					))}
				</Row>
			</ModalComponent>
		</div>
	)
}

export default DonationPageContainer
