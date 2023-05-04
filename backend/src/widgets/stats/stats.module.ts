import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UsersModule } from 'src/users/users.module'
import { StatsService } from './stats.service'
import { StatsController } from './stats.controller'
import { StatWidget } from './entities/stat-widget.entity'

@Module({
	imports: [UsersModule, TypeOrmModule.forFeature([StatWidget])],
	controllers: [StatsController],
	providers: [StatsService],
})
export class StatsModule {}
