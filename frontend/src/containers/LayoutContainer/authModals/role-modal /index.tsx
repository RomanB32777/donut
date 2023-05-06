import { FC, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { userRoles } from 'types'
import clsx from 'clsx'

import ModalComponent from 'components/ModalComponent'
import BaseButton from 'components/BaseButton'
import { ILandingModal } from 'appTypes'
import './styles.sass'

interface IRolesModal extends ILandingModal {
	chooseRole: (role: userRoles) => void
}

const RolesModal: FC<IRolesModal> = ({ isOpenModal, closeModal, chooseRole }) => {
	const [selectedRole, setSelectedRole] = useState<userRoles | null>(null)
	const roleHandler = (role: userRoles) => () => setSelectedRole(role)
	const btnHandler = () => selectedRole && chooseRole(selectedRole)

	return (
		<ModalComponent open={isOpenModal} onCancel={closeModal} width={540}>
			<div className="roleModal">
				<h1 className="modalTitle">
					<FormattedMessage id="roles_title" />
				</h1>
				<div className="roles">
					<div
						className={clsx('role', { isActive: selectedRole === 'creators' })}
						onClick={roleHandler('creators')}
					>
						<FormattedMessage id="roles_creator" />
					</div>
					<div
						className={clsx('role', { isActive: selectedRole === 'backers' })}
						onClick={roleHandler('backers')}
					>
						<FormattedMessage id="roles_supporter" />
					</div>
				</div>
				<div className="btnWrapper">
					<BaseButton
						formatId="roles_button"
						onClick={btnHandler}
						modificator="rolesBtn"
						disabled={!selectedRole}
						isMain
					/>
				</div>
			</div>
		</ModalComponent>
	)
}

export default RolesModal
