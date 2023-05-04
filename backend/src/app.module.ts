import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'
import { TypeOrmModule } from '@nestjs/typeorm'
import { join } from 'path'

import { SetConfigRoot } from './config/root.config'
import { staticFolder } from './common/const'
import { typeOrmAsyncConfig } from './config/typeorm.config'
import { UsersModule } from './users/users.module'
import { NotificationsModule } from './notifications/notifications.module'
import { WidgetsModule } from './widgets/widgets.module'
import { FilesModule } from './files/files.module'
import { DonationsModule } from './donations/donations.module'
import { BadgesModule } from './badges/badges.module'
import { SocketsModule } from './sockets/sockets.module'
import { AuthModule } from './auth/auth.module'
import { MailModule } from './mail/mail.module'

@Module({
	imports: [
		SetConfigRoot(),
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', staticFolder),
		}),
		TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
		UsersModule,
		BadgesModule,
		DonationsModule,
		NotificationsModule,
		WidgetsModule,
		FilesModule,
		SocketsModule,
		AuthModule,
		MailModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
