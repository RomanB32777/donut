import {
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
	MessageBody,
} from '@nestjs/websockets'
import { Socket, Server } from 'socket.io'
import { IBadgeBase, ISocketEmitObj, ISocketNotification } from 'types'

import { SocketsService } from './sockets.service'
import { Rooms } from './rooms/rooms.decorator'
import { EmitClientData, RoomDto } from './dto/room.dto'

@WebSocketGateway({
	path: '/sockt/',
	cors: {
		origin: '*',
	},
})
export class SocketsGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(private readonly socketsService: SocketsService) {}

	@WebSocketServer() server: Server

	handleDisconnect(client: Socket) {
		console.log(`Disconnected: ${client.id}`)
	}

	handleConnection(client: Socket) {
		const { id, handshake } = client
		const { username } = handshake.query

		username && client.join(username)
		console.log(`Connected ${username} - ${id}`)
	}

	emitDataToClient({ rooms, event, data }: EmitClientData) {
		const socketsCallbackFn = (socketId: string) =>
			this.server.sockets.to(socketId).emit(event, data)

		if (Array.isArray(rooms)) {
			rooms.forEach(({ sockets }) => sockets.forEach(socketsCallbackFn))
		} else rooms.sockets.forEach(socketsCallbackFn)
	}

	@SubscribeMessage('newDonate')
	async handleDonateMessage(
		@Rooms() rooms: RoomDto[],
		@MessageBody() payload: ISocketEmitObj,
	): Promise<void> {
		const newDonateNotification = await this.socketsService.createDonateNotification(payload)

		if (newDonateNotification?.donation) {
			const { donation, users } = newDonateNotification
			const { isAnonymous, sum, blockchain, message } = donation

			const sender = users.find((user) => user.roleplay === 'sender')
			const recipient = users.find((user) => user.roleplay === 'recipient')

			const recipientRoom = rooms.find(({ room }) => room === recipient.user.username)

			if (recipientRoom) {
				const sendObj: ISocketNotification = {
					type: 'donate',
					supporter: isAnonymous ? 'anonymous' : sender.user.username,
					additional: {
						sum,
						blockchain,
						message,
					},
				}

				this.emitDataToClient({
					rooms: recipientRoom,
					event: 'newDonate',
					data: sendObj,
				})
			}
		}
	}

	@SubscribeMessage('newBadge')
	async handleBadgeMessage(
		@Rooms() rooms: RoomDto[],
		@MessageBody() payload: ISocketEmitObj,
	): Promise<void> {
		const newDonateNotification = await this.socketsService.createBadgeNotification(payload)

		if (newDonateNotification?.badge) {
			const { badge, users } = newDonateNotification
			const { id, title } = badge

			const recipient = users.find((user) => user.roleplay === 'recipient')

			const recipientRoom = rooms.find(({ room }) => room === recipient.user.username)

			if (recipientRoom) {
				const sendObj: ISocketNotification<IBadgeBase> = {
					type: 'add_badge',
					supporter: recipient.user.username, // TODO
					additional: {
						id,
						title,
					},
				}

				this.emitDataToClient({
					rooms: recipientRoom,
					event: 'newBadge',
					data: sendObj,
				})
			}
		}
	}

	@SubscribeMessage('widgetChange')
	async handleWidgetChanges(
		@Rooms() rooms: RoomDto[],
		@MessageBody() payload: ISocketEmitObj,
	): Promise<void> {
		const { toSendUsername, type } = payload
		const recipientRoom = rooms.find(({ room }) => room === toSendUsername)

		if (recipientRoom) {
			const sendObj: Pick<ISocketNotification, 'type'> = {
				type,
			}

			this.emitDataToClient({
				rooms: recipientRoom,
				event: 'widgetChange',
				data: sendObj,
			})
		}
	}
}
