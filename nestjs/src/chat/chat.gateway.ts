import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ChatService } from './chat.service';

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token as string;
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      });

      client.data.user = payload;
      const userId = payload.id;
      client.join(`user_${userId}`);
      console.log(`User ${userId} connected to chat`);
    } catch (error) {
      console.error('Chat WS connection error:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const user = client.data?.user;
    if (user) {
      console.log(`User ${user.id} disconnected from chat`);
    }
  }

  @SubscribeMessage('joinAdminRoom')
  handleJoinAdminRoom(client: Socket) {
    const user = client.data?.user;
    if (!user) {
      console.log('[ChatGateway] joinAdminRoom: no user data');
      return;
    }
    client.join('admin_room');
    console.log(`[ChatGateway] User ${user.id} joined admin_room`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    client: Socket,
    payload: { content: string; receiverId?: number },
  ) {
    const user = client.data?.user;
    if (!user) {
      console.log('[ChatGateway] sendMessage: no user data');
      return;
    }

    const receiverId = payload.receiverId || null;
    console.log(`[ChatGateway] sendMessage from user ${user.id}, receiverId: ${receiverId}, content: ${payload.content}`);

    const savedMessage = await this.chatService.create(
      user.id,
      payload.content,
      receiverId,
    );
    console.log('[ChatGateway] Message saved:', savedMessage);

    if (receiverId) {
      // Admin is replying to a specific user
      this.server.to(`user_${receiverId}`).emit('newMessage', savedMessage);
      console.log(`[ChatGateway] Emitted newMessage to user_${receiverId}`);
    } else {
      // User is sending to the system
      this.server.to(`user_${user.id}`).emit('newMessage', savedMessage);
      console.log(`[ChatGateway] Emitted newMessage to user_${user.id}`);
    }

    // Also notify admin room
    this.server.to('admin_room').emit('newMessage', {
      ...savedMessage,
      senderName: user.name,
      senderEmail: user.email,
    });
    console.log(`[ChatGateway] Emitted newMessage to admin_room`);
  }
}
