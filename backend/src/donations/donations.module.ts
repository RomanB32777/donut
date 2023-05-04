import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'

import { DonationsService } from './donations.service'
import { DonationsController } from './donations.controller'
import { Donation } from './entities/donation.entity'
import { WidgetsModule } from './widgets/widgets.module'
import { ExchangeModule } from './exchange/exchange.module'
import { UsersModule } from 'src/users/users.module'
import { GoalsModule } from 'src/widgets/goals/goals.module'

@Module({
	imports: [
		UsersModule,
		WidgetsModule,
		ExchangeModule,
		GoalsModule,
		TypeOrmModule.forFeature([Donation]),
	],
	controllers: [DonationsController],
	providers: [DonationsService],
	exports: [DonationsService],
})
export class DonationsModule {}
