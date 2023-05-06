import { FC } from 'react'
import { useIntl } from 'react-intl'
import { stringFormatTypes } from 'appTypes'

import SelectComponent from 'components/SelectComponent'
import { filterPeriodItems } from 'consts'
import './styles.sass'

interface IFilterSelect {
	selectedItem: stringFormatTypes
	selectItem: (selected: stringFormatTypes) => void
}

const FilterSelect: FC<IFilterSelect> = ({ selectedItem, selectItem }) => {
	const intl = useIntl()

	const renderOption = (item: stringFormatTypes) => {
		return intl.formatMessage({ id: item })
	}

	return (
		<div className="filter">
			<SelectComponent
				title={intl.formatMessage({ id: selectedItem })}
				list={Object.values(filterPeriodItems)}
				renderOption={renderOption}
				selectItem={selectItem}
				listWrapperModificator="filter-list"
			/>
		</div>
	)
}

export default FilterSelect
