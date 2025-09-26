import {
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RedisService } from '@notification/application/redis.service';

@WebSocketGateway({ cors: true })
export class NotificationGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;

  constructor(private readonly redisService: RedisService) {}

  handleConnection(client: Socket) {
    client.on('join', ({ room }) => {
      client.join(room);
    });
  }

  afterInit() {
    this.redisService.subscribe('notifications', (message: string) => {
      const notif = JSON.parse(message);
      this.server.to(`user`).emit('notification', notif);
    });
  }
}
