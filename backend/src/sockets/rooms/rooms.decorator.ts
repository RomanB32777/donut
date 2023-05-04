import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Socket, Server } from 'socket.io'

export const Rooms = createParamDecorator((isGetUserRooms: boolean, ctx: ExecutionContext) => {
	const request = ctx.switchToWs()
	const client: Socket = request.getClient()
	const server: Server = request.getClient().server

	const { username } = client.handshake.query
	const socketRooms = server.sockets.adapter.rooms

	const arr = Array.from(socketRooms)
	const rooms = arr.filter((room) => !room[1].has(room[0]))
	const filteredRooms = rooms.map((i) => ({
		room: i[0],
		sockets: Array.from(i[1]),
	}))
	if (isGetUserRooms) {
		const userRoom = filteredRooms.find(({ room }) => room === username)
		return userRoom ?? filteredRooms
	}
	return filteredRooms
})
