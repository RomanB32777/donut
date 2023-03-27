export class RoomDto {
  room: string;
  sockets: string[];
}

export class EmitClientData {
  rooms: RoomDto | RoomDto[];
  event: string;
  data: any;
}
