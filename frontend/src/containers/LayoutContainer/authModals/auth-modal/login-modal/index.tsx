import { FC, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'
import { FormattedMessage } from 'react-intl'
import clsx from 'clsx'
import { ILoginUser } from 'types'

import BaseButton from 'components/BaseButton'
import FormInput from 'components/FormInput'

import useAuth from 'hooks/useAuth'
import { useLoginMutation } from 'store/services/AuthService'
import { isValidateFilledForm, setAuthToken } from 'utils'
import { dashboardPath, RoutePaths } from 'consts'
import { IAuthTypeModal } from 'appTypes'
import './styles.sass'

type IFormValid = Record<keyof ILoginUser, string | null>

const initValidState: IFormValid = {
	email: null,
	password: null,
}

const initState: ILoginUser = {
	email: '',
	password: '',
}

const LoginModal: FC<IAuthTypeModal> = ({ changeTypeModal }) => {
	const navigate = useNavigate()
	const { closeAuthModal } = useAuth()
	const [loginUser, { isLoading, isSuccess }] = useLoginMutation()

	const [form, setForm] = useState<ILoginUser>(initState)
	const [isNotValidFields, setIsNotValidFields] = useState(initValidState)

	const { email, password } = form

	const toRegistration = () => changeTypeModal('registration')

	const toResetPage = () => {
		closeAuthModal()
		navigate(`/${RoutePaths.reset}`)
	}

	const inputHandler = (key: keyof ILoginUser) => (value: string) => {
		setForm((form) => ({ ...form, [key]: value }))
		setIsNotValidFields(initValidState)
	}

	const btnHandler = async () => {
		try {
			const { access_token } = await loginUser(form).unwrap()

			if (access_token) {
				closeAuthModal()
				setAuthToken(access_token)
				navigate(dashboardPath)
			}
		} catch (error) {
			console.log(error)

			const { data } = error as FetchBaseQueryError

			if (data) {
				const message = (data as any).message as string | string[]
				if (Array.isArray(message)) {
					const notValidFields = message.reduce((acc, curr) => {
						const [field, messageText] = curr.split(':')
						return { ...acc, [field]: messageText }
					}, initValidState)

					setIsNotValidFields(notValidFields)
				} else {
					const [field, messageText] = message.split(':')
					setIsNotValidFields((fields) => ({
						...fields,
						[field]: messageText,
					}))
				}
			}
		}
	}

	const isFilledForm = useMemo(() => isValidateFilledForm(Object.values(form)), [form])

	useEffect(() => setForm(initState), [isSuccess])

	return (
		<div className="loginModal">
			<div className="loginModalContent">
				<div className="loginInputs">
					<div className="loginInputWrapper">
						<FormInput
							value={email}
							setValue={inputHandler('email')}
							modificator={clsx('loginInput', {
								isNotValid: !!isNotValidFields.email,
							})}
							descriptionInput={isNotValidFields.email}
							descriptionModificator="notValidMessage"
							placeholder="input_placeholder_email"
						/>
					</div>

					<div className="loginInputWrapper">
						<FormInput
							value={password}
							typeInput="password"
							setValue={inputHandler('password')}
							modificator={clsx('loginInput', {
								isNotValid: !!isNotValidFields.password,
							})}
							descriptionInput={isNotValidFields.password}
							descriptionModificator="notValidMessage"
							placeholder="input_placeholder_password"
						/>
					</div>

					<div className="btnWrapper">
						<BaseButton
							formatId="login_button"
							onClick={btnHandler}
							modificator="loginBtn"
							disabled={!isFilledForm || isLoading}
							isMain
						/>
					</div>

					<p className="loginLink">
						<FormattedMessage id="login_no_account" />
						<span onClick={toRegistration}>
							<FormattedMessage id="login_link" />
						</span>
					</p>

					<p className="resetLink" onClick={toResetPage}>
						<FormattedMessage id="login_forgot" />
					</p>
				</div>
			</div>
		</div>
	)
}

export default LoginModal
