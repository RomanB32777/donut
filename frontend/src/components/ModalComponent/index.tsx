import { FC, useEffect } from 'react'
import { Modal, ModalProps } from 'antd'
import clsx from 'clsx'

import useWindowDimensions from 'hooks/useWindowDimensions'
import Loader from 'components/Loader'
import './styles.sass'

export interface IModalComponent extends ModalProps {
	topModal?: boolean
	noPadding?: boolean
	children?: React.ReactNode
}

const ModalComponent: FC<IModalComponent> = ({
	width,
	confirmLoading,
	topModal,
	centered,
	noPadding,
	children,
	className,
	...props
}) => (
	<Modal
		{...props}
		confirmLoading={confirmLoading}
		width={width || 520}
		style={{ top: topModal ? 20 : centered ? 0 : 100 }}
		footer={null}
		bodyStyle={{
			padding: noPadding ? 0 : 24,
		}}
		centered={centered}
		className={clsx('app-modal', className)}
		transitionName=""
	>
		<div
			className={clsx('modal-content-wrapper', {
				noPadding,
			})}
		>
			{children}
		</div>
	</Modal>
)

interface ILoadingModalComponent extends IModalComponent {
	message: React.ReactNode
}

export const LoadingModalComponent: FC<ILoadingModalComponent> = ({ message, ...props }) => (
	<ModalComponent {...props} closable={false} width={600}>
		<div className="donat-loading">
			<p className="message">{message}</p>
			<Loader size="big" />
		</div>
	</ModalComponent>
)

export const ErrorModalComponent: FC<ILoadingModalComponent> = ({ message, ...props }) => (
	<ModalComponent {...props} closable={false} width={600}>
		<div className="modal-error">
			<p className="message">{message}</p>
			{/* dangerouslySetInnerHTML={{ __html: message }} */}
		</div>
	</ModalComponent>
)

interface ISuccessModalComponent extends ILoadingModalComponent {
	onClose: () => void
	showDurationPopup?: number
	description?: React.ReactNode
}

export const SuccessModalComponent: FC<ISuccessModalComponent> = ({
	message,
	open,
	onClose,
	showDurationPopup,
	description,
	...props
}) => {
	const { isTablet } = useWindowDimensions()

	useEffect(() => {
		let timeOut: NodeJS.Timeout | undefined
		if (open)
			timeOut = setTimeout(() => {
				onClose()
			}, showDurationPopup || 5000)

		return () => clearTimeout(timeOut)
	}, [open])

	return (
		<ModalComponent
			open={open}
			closable={false}
			width={isTablet ? 500 : 700}
			topModal={!isTablet}
			noPadding
			centered
			{...props}
		>
			<div className="modal-success" onClick={onClose}>
				<p className="message">{message}</p>
				{description && <p className="description">{description}</p>}
			</div>
		</ModalComponent>
	)
}

export default ModalComponent
