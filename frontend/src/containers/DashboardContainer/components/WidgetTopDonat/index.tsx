import { useEffect, useMemo, useState } from 'react'
import { createSelector } from '@reduxjs/toolkit'
import { FormattedMessage } from 'react-intl'

import TableComponent from 'components/TableComponent'
import EmptyComponent from 'components/EmptyComponent'
import useWindowDimensions from 'hooks/useWindowDimensions'
import WidgetItem from '../WidgetItem'
import FilterSelect from '../FilterSelect'

import { useAppSelector } from 'hooks/reduxHooks'
import { useGetWidgetDonationsQuery } from 'store/services/DonationsService'
import { ITableData, tableColums } from './tableData'
import { formatNumber, getTimePeriodQuery } from 'utils'
import { filterPeriodItems } from 'consts'
import { IDonationWidgetInfo } from 'appTypes'

const LIMIT_DONATS = 6

const WidgetTopDonat = () => {
	const { isTablet } = useWindowDimensions()
	const { id, creator } = useAppSelector(({ user }) => user)
	const { list, shouldUpdateApp } = useAppSelector(({ notifications }) => notifications)

	const [activeFilterItem, setActiveFilterItem] = useState(filterPeriodItems['7days'])

	const timePeriod = useMemo(() => getTimePeriodQuery(activeFilterItem), [activeFilterItem])

	const selectDonationsData = useMemo(
		() =>
			createSelector(
				(res: any) => res.data,
				(data) => {
					const forTableData: ITableData[] = data?.map(
						({ backer, username, ...donat }: IDonationWidgetInfo) => ({
							...donat,
							username: username ?? backer?.username,
							sum: formatNumber(donat.sum),
							key: donat.id,
						})
					)

					return forTableData ?? []
				}
			),
		[]
	)

	const { topDonations, isLoading, refetch } = useGetWidgetDonationsQuery(
		{
			userId: id,
			dataType: 'top-donations',
			query: {
				limit: LIMIT_DONATS,
				timePeriod,
				spamFilter: creator?.spamFilter,
			},
		},
		{
			skip: !id,
			selectFromResult: (result) => ({
				...result,
				topDonations: selectDonationsData(result),
			}),
		}
	)

	useEffect(() => {
		list.length && shouldUpdateApp && refetch()
	}, [list, shouldUpdateApp])

	return (
		<div className="widget widget-topDonat">
			<div className="header">
				<span className="widget-title">
					<FormattedMessage id="dashboard_widgets_donations" />
				</span>
				<FilterSelect selectedItem={activeFilterItem} selectItem={setActiveFilterItem} />
			</div>
			<div className="items">
				{!isTablet && (
					<TableComponent
						dataSource={topDonations}
						columns={tableColums}
						loading={isLoading}
						pagination={false}
					/>
				)}
				{isTablet &&
					Boolean(topDonations.length) &&
					// TODO - remove any
					topDonations.map((donat: any) => {
						return <WidgetItem key={donat.key} donat={donat} symbol={donat.blockchain} />
					})}
				{isTablet && !topDonations.length && <EmptyComponent />}
			</div>
		</div>
	)
}

export default WidgetTopDonat
