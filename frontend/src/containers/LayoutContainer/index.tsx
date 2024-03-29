import { useMemo, useEffect, useContext } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { FloatButton, Layout } from 'antd'
import { useIntl } from 'react-intl'
import DocumentTitle from 'react-document-title'
import clsx from 'clsx'

import Loader from 'components/Loader'
import AuthModals from './authModals'
import useAuth from 'hooks/useAuth'
import { useCheckTokenQuery } from 'store/services/AuthService'
import { Pages, routersInfo, routers, RoutePaths } from 'routes'
import { AppContext } from 'contexts/AppContext'
import { dashboardPath } from 'consts'
import { setAuthToken } from 'utils'
import { LOCALES } from 'appTypes'
import './styles.sass'

const { Content } = Layout

const transparentClass = 'transparent'

const LayoutApp = () => {
	const navigate = useNavigate()
	const intl = useIntl()
	const { pathname } = useLocation()
	const [searchParams, setSearchParams] = useSearchParams()
	const { checkAuth, isAuthLoading } = useAuth()
	const { handleLocale } = useContext(AppContext)

	const tokenId = searchParams.get('token')
	const confirmStatus = searchParams.get('confirmStatus')
	const email = searchParams.get('email')
	const langParam = searchParams.get('lang')
	const registrationStatus = searchParams.get('registration')

	const { data: tokenData, isError } = useCheckTokenQuery(tokenId ?? skipToken)

	const isTransparentMainContainer: boolean = useMemo(() => {
		const pathsWithTransparentBgLayoutElements = routers.filter((route) => route.transparent)

		const isTransparent = pathsWithTransparentBgLayoutElements.some(
			(route) => pathname.split('/')[1] === route.path?.split('/')[0]
		)

		const bodyClasses = document.querySelector('body')?.classList

		if (bodyClasses)
			isTransparent ? bodyClasses.add(transparentClass) : bodyClasses.remove(transparentClass)

		return isTransparent
	}, [pathname])

	const noPaddingMainContainer: boolean = useMemo(() => {
		const pathsWithoutPaddingMainContainer = routers.filter((route) => route.noPaddingMainContainer)

		return pathsWithoutPaddingMainContainer.some(
			(route) => pathname.split('/')[1] === route.path?.split('/')[0]
		)
	}, [pathname])

	const titleApp: string | undefined = useMemo(() => {
		const pathElements = pathname.split('/')
		const allRoutesPath = Object.keys(routersInfo)

		const currentPage = pathElements.reverse().find((el) => {
			return allRoutesPath.includes(el)
		})

		if (currentPage) return intl.formatMessage({ id: routersInfo[currentPage].name })
		return ''
	}, [pathname])

	const deleteParams = (...params: string[]) => {
		params.forEach((param) => searchParams.delete(param))
		setSearchParams(searchParams)
	}

	useEffect(() => {
		if (registrationStatus) deleteParams('registration')
	}, [])

	useEffect(() => {
		const checkTokenData = async () => {
			if (tokenData && confirmStatus === 'true') {
				setAuthToken(tokenData.access_token)
				await checkAuth()
				deleteParams('token', 'confirmStatus')
				navigate(dashboardPath)
			}
		}

		checkTokenData()
	}, [tokenData, confirmStatus])

	useEffect(() => {
		if (confirmStatus === 'false' && email) navigate(RoutePaths.main)
	}, [confirmStatus, email])

	useEffect(() => {
		if (langParam) {
			const selectedLocale = langParam as LOCALES
			deleteParams('lang')
			handleLocale(selectedLocale)
		}
	}, [langParam])

	useEffect(() => {
		if (isError) navigate(RoutePaths.main)
	}, [isError])

	if (isAuthLoading) {
		return (
			<div className="appLoader">
				<Loader size="big" />
			</div>
		)
	}

	return (
		<DocumentTitle title={`Crypto Donutz${titleApp?.length ? ` - ${titleApp}` : ''}`}>
			<Layout
				className={clsx('layout-container', {
					[transparentClass]: isTransparentMainContainer,
				})}
			>
				<FloatButton.BackTop />
				<Layout
					className={clsx('site-layout', {
						[transparentClass]: isTransparentMainContainer,
					})}
				>
					<Content
						className={clsx('content-container', {
							[transparentClass]: isTransparentMainContainer,
						})}
					>
						<div
							className={clsx('main-container', {
								noPadding: noPaddingMainContainer,
							})}
						>
							<Pages />
						</div>
					</Content>
					<AuthModals />
				</Layout>
			</Layout>
		</DocumentTitle>
	)
}

export default LayoutApp
