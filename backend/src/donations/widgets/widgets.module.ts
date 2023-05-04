import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UsersModule } from 'src/users/users.module'
import { Donation } from '../entities/donation.entity'
import { WidgetsService } from './widgets.service'
import { WidgetsController } from './widgets.controller'
import { ExchangeModule } from '../exchange/exchange.module'

@Module({
	imports: [UsersModule, ExchangeModule, TypeOrmModule.forFeature([Donation])],
	controllers: [WidgetsController],
	providers: [WidgetsService],
	exports: [WidgetsService],
})
export class WidgetsModule {}
