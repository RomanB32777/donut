import { FC, memo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'

import BaseButton from 'components/BaseButton'
import { useAppSelector } from 'hooks/reduxHooks'
import useAuth from 'hooks/useAuth'
import { RoutePaths } from 'consts'

interface ILandingButton {
	localeText: string
	modificator?: string
}

const LandingButton: FC<ILandingButton> = ({ localeText, modificator }) => {
	const { id } = useAppSelector(({ user }) => user)
	const navigate = useNavigate()
	const { setActiveAuthModal } = useAuth()

	const signUp = useCallback(() => {
		if (id) navigate(`/${RoutePaths.admin}/${RoutePaths.dashboard}`)
		else setActiveAuthModal('roles')
	}, [id])

	return (
		<BaseButton
			formatId={localeText}
			onClick={signUp}
			modificator={clsx('landing-btn', modificator)}
			isMain
		/>
	)
}

export default memo(LandingButton)
