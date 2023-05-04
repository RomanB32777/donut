import { Module } from '@nestjs/common'
import { SocketsService } from './sockets.service'
import { SocketsGateway } from './sockets.gateway'
import { UsersModule } from 'src/users/users.module'
import { DonationsModule } from 'src/donations/donations.module'
import { BadgesModule } from 'src/badges/badges.module'
import { NotificationsModule } from 'src/notifications/notifications.module'

@Module({
	imports: [UsersModule, DonationsModule, BadgesModule, NotificationsModule],
	providers: [SocketsGateway, SocketsService],
})
export class SocketsModule {}
