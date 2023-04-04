import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { IBadgeBase, ISocketEmitObj, ISocketNotification } from 'types';

import { SocketsService } from './sockets.service';
import { Rooms } from './rooms/rooms.decorator';
import { EmitClientData, RoomDto } from './dto/room.dto';

@WebSocketGateway({
  path: '/sockt/',
  cors: {
    origin: '*',
  },
})
export class SocketsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly socketsService: SocketsService) {}

  @WebSocketServer() server: Server;

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
  }

  handleConnection(client: Socket) {
    const { id, handshake } = client;
    const { username } = handshake.query;

    username && client.join(username);
    console.log(`Connected ${username} - ${id}`);
  }

  emitDataToClient({ rooms, event, data }: EmitClientData) {
    const socketsCallbackFn = (socketId: string) =>
      this.server.sockets.to(socketId).emit(event, data);

    if (Array.isArray(rooms)) {
      rooms.forEach(({ sockets }) => sockets.forEach(socketsCallbackFn));
    } else rooms.sockets.forEach(socketsCallbackFn);
  }

  @SubscribeMessage('newDonat')
  async handleDonatMessage(
    @Rooms() rooms: RoomDto[],
    @MessageBody() payload: ISocketEmitObj,
  ): Promise<void> {
    const newDonatNotification =
      await this.socketsService.createDonatNotification(payload);

    if (newDonatNotification && newDonatNotification.donation) {
      const { donation, users } = newDonatNotification;
      const { isAnonymous, sum, blockchain, message } = donation;

      const sender = users.find((user) => user.roleplay === 'sender');
      const recipient = users.find((user) => user.roleplay === 'recipient');

      const sendObj: ISocketNotification = {
        type: 'donat',
        supporter: isAnonymous ? 'anonymous' : sender.user.username,
        additional: {
          sum,
          blockchain,
          message,
        },
      };

      const recipientRoom = rooms.find(
        ({ room }) => room === recipient.user.username,
      );

      if (recipientRoom) {
        this.emitDataToClient({
          rooms: recipientRoom,
          event: 'newDonat',
          data: sendObj,
        });
      }
    }
  }

  @SubscribeMessage('newBadge')
  async handleBadgeMessage(
    @Rooms() rooms: RoomDto[],
    @MessageBody() payload: ISocketEmitObj,
  ): Promise<void> {
    const newDonatNotification =
      await this.socketsService.createBadgeNotification(payload);

    if (newDonatNotification && newDonatNotification.badge) {
      const { badge, users } = newDonatNotification;
      const { id, title } = badge;

      const recipient = users.find((user) => user.roleplay === 'recipient');

      const sendObj: ISocketNotification<IBadgeBase> = {
        type: 'add_badge',
        supporter: recipient.user.username, // TODO
        additional: {
          id,
          title,
        },
      };

      const recipientRoom = rooms.find(
        ({ room }) => room === recipient.user.username,
      );

      if (recipientRoom) {
        this.emitDataToClient({
          rooms: recipientRoom,
          event: 'newBadge',
          data: sendObj,
        });
      }
    }
  }
}
