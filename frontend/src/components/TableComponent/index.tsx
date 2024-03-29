import React from 'react'
import { Table, ConfigProvider } from 'antd'
import type { TableProps } from 'antd/es/table'
import Loader from 'components/Loader'
import EmptyComponent from 'components/EmptyComponent'
import './styles.sass'

type ITableData<T> = TableProps<T>

const TableComponent = <T extends object>({
	dataSource,
	columns,
	pagination,
	loading,
}: React.PropsWithChildren<ITableData<T>>): React.ReactElement => (
	<ConfigProvider renderEmpty={EmptyComponent}>
		<Table
			className="app-table"
			columns={columns}
			dataSource={dataSource}
			pagination={pagination}
			loading={{
				spinning: loading as boolean,
				indicator: <Loader size="small" />,
				className: 'table-loader',
			}}
		/>
	</ConfigProvider>
)

export default TableComponent
