import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { FilesModule } from 'src/files/files.module'
import { UsersModule } from 'src/users/users.module'
import { AlertWidget } from './entities/alert-widget.entity'
import { AlertsService } from './alerts.service'
import { AlertsController } from './alerts.controller'

@Module({
	imports: [forwardRef(() => UsersModule), FilesModule, TypeOrmModule.forFeature([AlertWidget])],
	controllers: [AlertsController],
	providers: [AlertsService],
	exports: [AlertsService],
})
export class AlertsModule {}
