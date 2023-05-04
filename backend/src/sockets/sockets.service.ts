import { NotFoundException, Injectable } from '@nestjs/common'
import { ISocketEmitObj } from 'types'

import { NotificationsService } from 'src/notifications/notifications.service'
import { DonationsService } from 'src/donations/donations.service'
import { BadgesService } from 'src/badges/badges.service'
import { UsersService } from 'src/users/users.service'

@Injectable()
export class SocketsService {
	constructor(
		private readonly notificationsService: NotificationsService,
		private readonly donationsService: DonationsService,
		private readonly badgesService: BadgesService,
		private readonly usersService: UsersService,
	) {}

	async createDonateNotification({ id: donateId }: ISocketEmitObj) {
		const donation = await this.donationsService.findOne(donateId)

		if (donation) {
			const { creator, backer } = donation
			return await this.notificationsService.create({
				donation,
				users: [
					{
						roleplay: 'sender',
						user: backer,
					},
					{
						roleplay: 'recipient',
						user: creator,
					},
				],
			})
		}
	}

	async createBadgeNotification({ id: badgeId, toSendUsername }: ISocketEmitObj) {
		const badge = await this.badgesService.findOne(badgeId)

		if (badge) {
			const { creator } = badge
			const recipient = await this.usersService.getUserByUsername(toSendUsername)

			if (!recipient) {
				throw new NotFoundException('Recipient not found')
			}

			return await this.notificationsService.create({
				badge,
				users: [
					{
						roleplay: 'sender',
						user: creator,
					},
					{
						roleplay: 'recipient',
						user: recipient,
					},
				],
			})
		}
	}
}
