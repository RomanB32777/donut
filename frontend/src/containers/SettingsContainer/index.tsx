import { useCallback, useEffect, useMemo, useState } from 'react'
import { Col, Row } from 'antd'
import clsx from 'clsx'
import { FormattedMessage, useIntl } from 'react-intl'
import { ICreatorInfo } from 'types'

import { useAppSelector } from 'hooks/reduxHooks'
import { WalletsModal } from 'components/ModalComponent/wallets-modal'
import PageTitle from 'components/PageTitle'
import FormInput from 'components/FormInput'
import BaseButton from 'components/BaseButton'
import ConfirmPopup from 'components/ConfirmPopup'
import UploadImage from 'components/UploadImage'
import SwitchForm from 'components/SwitchForm'
import VideoBlock from 'components/video-block/video-block'

import {
	useDeleteUserMutation,
	useEditCreatorMutation,
	useEditUserMutation,
} from 'store/services/UserService'
import useAuth from 'hooks/useAuth'
import { copyStr, shortStr } from 'utils'
import { IUserWithFiles } from 'appTypes'
import './styles.sass'

interface IFormSettings
	extends Pick<IUserWithFiles, 'avatarLink' | 'walletAddress' | 'username'>,
		Pick<ICreatorInfo, 'spamFilter'> {}

type formKeys = keyof IFormSettings

const initState: IFormSettings = {
	avatarLink: {
		file: null,
		preview: '',
	},
	walletAddress: '',
	username: '',
	spamFilter: false,
}

const videoLinks = [
	'https://www.youtube.com/embed/GNPz-Dv5BjM',
	'https://www.youtube.com/embed/fgWJ8x7fKuo',
]

const SettingsContainer = () => {
	const intl = useIntl()
	const [editUser, { isLoading }] = useEditUserMutation()
	const [editCreatorInfo] = useEditCreatorMutation()
	const [deleteUser] = useDeleteUserMutation()
	const { logout } = useAuth()
	const user = useAppSelector(({ user }) => user)

	const [isOpenWalletsModal, setIsOpenWalletsModal] = useState(false)
	const [formSettings, setFormSettings] = useState<IFormSettings>(initState)

	const { creator, roleplay } = user
	const { username, walletAddress, avatarLink, spamFilter } = formSettings

	const isCreator = roleplay === 'creators'

	const formElementsHandler = useCallback(
		<T,>(field: keyof IFormSettings) =>
			(value: T) =>
				setFormSettings((form) => ({ ...form, [field]: value })),
		[]
	)

	const openWalletsModal = () => setIsOpenWalletsModal(true)
	const closeWalletsModal = () => setIsOpenWalletsModal(false)

	const setWalletAddress = async (walletAddress: string) => {
		if (walletAddress !== user.walletAddress) {
			await editUser({ walletAddress })
		}
		closeWalletsModal()
	}

	const copyWalletAddress = () => {
		copyStr({
			str: walletAddress,
			copyObject: intl.formatMessage({ id: 'copy_message_wallet' }),
		})
	}

	const changeUserData = async (
		changedFields: {
			key: formKeys
			value: any
		}[]
	) => {
		if (!isLoading && changedFields.length) {
			const changedUserInfo = {
				...changedFields.reduce(
					(acc, { key, value }) => ({
						...acc,
						[key]: value,
					}),
					{} as Partial<IFormSettings>
				),
			}
			const { avatarLink, spamFilter, ...baseInfo } = changedUserInfo

			if (typeof spamFilter !== 'undefined') {
				await editCreatorInfo({ spamFilter })
			}

			const [editArgs]: Parameters<typeof editUser> = [baseInfo]

			const uploadedFile = avatarLink?.file

			if (uploadedFile) editArgs.avatar = uploadedFile
			await editUser(editArgs)
		}
	}

	const usernameBtnClick = async () => {
		await changeUserData([{ key: 'username', value: username }])
	}

	const saveSettings = async () => {
		const changedFields = changedElements.map((field) => {
			const key = field as formKeys
			return {
				key,
				value: formSettings[key],
			}
		})

		await changeUserData(changedFields)
	}

	const avatarBtnClick = async () =>
		await changeUserData([{ key: 'avatarLink', value: avatarLink.file }])

	const deleteProfile = async () => {
		await deleteUser()
		logout()
	}

	const shortWalletToken = useMemo(
		() => (walletAddress ? shortStr(walletAddress, 12) : ''),
		[walletAddress]
	)

	const changedElements = useMemo(
		() =>
			Object.keys(formSettings).filter((key) => {
				const keyType = key as formKeys

				if (keyType === 'avatarLink') {
					return formSettings[keyType].preview !== user[keyType]
				} else if (keyType === 'spamFilter') {
					if (user.creator) {
						return formSettings[keyType] !== user.creator[keyType]
					}
					return false
				} else return formSettings[keyType] !== user[keyType]
			}),
		[formSettings, user]
	)

	useEffect(() => {
		const { id, username, walletAddress, creator, avatarLink } = user
		if (id) {
			setFormSettings((form) => {
				const updatedState: IFormSettings = {
					...form,
					username,
					walletAddress,
					avatarLink: {
						...form.avatarLink,
						preview: avatarLink || '',
					},
				}

				if (creator) updatedState.spamFilter = creator.spamFilter
				return updatedState
			})
		}
	}, [user])

	return (
		<div className="settingsPage-container fadeIn">
			<PageTitle formatId="page_title_settings" />
			<div className="videoBlocks">
				<Row justify="space-between" gutter={[0, 32]}>
					{videoLinks.map((link, index) => (
						<Col md={24} xl={12} key={index} className="videoCol">
							<VideoBlock
								link={link}
								modificator={clsx('videoModificator', { right: index % 2 })}
							/>
						</Col>
					))}
				</Row>
			</div>

			<div className="stats-drawer__form">
				<Row gutter={[0, 18]} className="form">
					<Col xl={18} xs={24}>
						<div className="form-element">
							<Row justify="space-between" align="middle">
								<Col span={16}>
									<UploadImage
										label={<FormattedMessage id="settings_avatar" />}
										formats={['PNG', 'JPG', 'JPEG', 'GIF']}
										filePreview={avatarLink.preview}
										setFile={formElementsHandler('avatarLink')}
										labelCol={8}
										inputCol={15}
										rowProps={{ justify: 'space-between' }}
									/>
								</Col>
								<Col span={7}>
									<p
										className={clsx('action', {
											active: changedElements.includes('avatarLink'),
										})}
										onClick={avatarBtnClick}
									>
										<FormattedMessage id="settings_change_button" />
									</p>
								</Col>
							</Row>
						</div>
					</Col>
					<Col xl={18} xs={24}>
						<div className="form-element">
							<Row justify="space-between" align="middle">
								<Col span={16}>
									<FormInput
										label={<FormattedMessage id="settings_username" />}
										name="username"
										value={username}
										setValue={formElementsHandler('username')}
										labelCol={8}
										inputCol={15}
										gutter={[0, 16]}
										rowProps={{ justify: 'space-between' }}
									/>
								</Col>
								<Col span={7}>
									<p
										className={clsx('action', {
											active: changedElements.includes('username'),
										})}
										onClick={usernameBtnClick}
									>
										<FormattedMessage id="settings_change_button" />
									</p>
								</Col>
							</Row>
						</div>
					</Col>
					<Col xl={18} xs={24}>
						<div className="form-element">
							<Row justify="space-between" align="middle">
								<Col span={16}>
									<FormInput
										label={<FormattedMessage id="settings_wallet" />}
										name="wallet"
										value={shortWalletToken}
										addonsModificator="wallet-addon"
										labelCol={8}
										inputCol={15}
										gutter={[0, 16]}
										rowProps={{ justify: 'space-between' }}
									/>
								</Col>
								{isCreator && (
									<Col md={{ offset: 1, span: 3 }} xs={{ offset: 0, span: 10 }}>
										<p className="action wallet" onClick={openWalletsModal}>
											<FormattedMessage id="settings_change_button" />
										</p>
									</Col>
								)}
								<Col md={{ span: isCreator ? 4 : 7 }} xs={{ span: 14 }}>
									<p
										className={clsx('action wallet', {
											disabled: !walletAddress,
										})}
										onClick={copyWalletAddress}
									>
										<FormattedMessage id="settings_copy_button" />
									</p>
								</Col>
							</Row>
						</div>
					</Col>
					{creator && (
						<Col xl={18} xs={24}>
							<div className="form-element">
								<SwitchForm
									label={<FormattedMessage id="settings_spam_filter" />}
									checked={spamFilter}
									setValue={formElementsHandler('spamFilter')}
									labelModificator="switch-label"
									labelCol={6}
									switchCol={2}
									gutter={[0, 16]}
								/>
							</div>
						</Col>
					)}
					<Col span={24}>
						<div className="btn-bottom">
							<BaseButton
								formatId="save_changes_button"
								modificator="settingsBtn saveBtn"
								onClick={saveSettings}
								disabled={isLoading || !username || !changedElements.length}
								isMain
							/>
							<ConfirmPopup confirm={deleteProfile}>
								<BaseButton
									formatId="settings_delete_account"
									modificator="settingsBtn"
									disabled={isLoading}
									isBlack
								/>
							</ConfirmPopup>
						</div>
					</Col>
				</Row>
			</div>
			<WalletsModal
				open={isOpenWalletsModal}
				onCancel={closeWalletsModal}
				connectedWallet={setWalletAddress}
				width={500}
				isSettings
			/>
		</div>
	)
}

export default SettingsContainer
