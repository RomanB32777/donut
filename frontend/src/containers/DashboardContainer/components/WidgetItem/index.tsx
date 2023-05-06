import { FC, memo } from 'react'
import { Col, Row } from 'antd'
import dayjsModule from 'modules/dayjsModule'

import { formatNumber } from 'utils'
import { IDonationWidgetInfo } from 'appTypes'
import './styles.sass'

interface IDonationWidgetItem {
	donat: IDonationWidgetInfo
	symbol?: string
}

const WidgetItem: FC<IDonationWidgetItem> = ({ donat, symbol = 'USD' }) => (
	<div className="widget-item">
		<Row gutter={[32, 0]}>
			<Col span={24}>
				<div className="row">
					<Row justify="space-between" align="middle" style={{ width: '100%' }}>
						<Col xs={17} md={18}>
							<div className="header">
								<div className="name">{donat?.backer?.username ?? donat?.username}</div>
								<div className="sum">
									{formatNumber(donat.sum, 2)}&nbsp; {symbol}
								</div>
							</div>
						</Col>
						<Col xs={5} md={4}>
							<div className="time">
								{dayjsModule(donat.createdAt).startOf('minutes').fromNow()}
							</div>
						</Col>
					</Row>
					<p className="message">{donat.message}</p>
				</div>
			</Col>
		</Row>
	</div>
)

export default memo(WidgetItem)
