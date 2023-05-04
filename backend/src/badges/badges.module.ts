import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { FilesModule } from 'src/files/files.module'
import { UsersModule } from 'src/users/users.module'

import { BadgesController } from './badges.controller'
import { BadgesService } from './badges.service'
import { Badge } from './entities/badge.entity'

@Module({
	imports: [ConfigModule, FilesModule, UsersModule, TypeOrmModule.forFeature([Badge])],
	controllers: [BadgesController],
	providers: [BadgesService],
	exports: [BadgesService],
})
export class BadgesModule {}
