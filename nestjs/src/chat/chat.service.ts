import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private readonly usersService: UsersService,
  ) {}

  async create(userId: number, content: string, receiverId?: number) {
    const message = this.messageRepository.create({
      senderId: userId,
      receiverId: receiverId ?? null,
      content,
    });
    return this.messageRepository.save(message);
  }

  async findHistoryByUser(userId: number) {
    return this.messageRepository.find({
      where: [{ senderId: userId }, { receiverId: userId }],
      order: { createdAt: 'ASC' },
    });
  }

  async findHistoryForAdmin(userId: number) {
    return this.messageRepository.find({
      where: [{ senderId: userId }, { receiverId: userId }],
      order: { createdAt: 'ASC' },
    });
  }

  async findUsersWithMessages() {
    // Lấy unique userId từ:
    // 1. senderId khi receiverId IS NULL (tin nhắn user gửi cho hệ thống)
    // 2. receiverId khi receiverId IS NOT NULL (tin nhắn admin gửi cho user)
    const raw = await this.messageRepository.query(`
      SELECT "userId", MAX("lastMessageAt") as "lastMessageAt"
      FROM (
        SELECT "senderId" as "userId", "createdAt" as "lastMessageAt"
        FROM "message"
        WHERE "receiverId" IS NULL

        UNION ALL

        SELECT "receiverId" as "userId", "createdAt" as "lastMessageAt"
        FROM "message"
        WHERE "receiverId" IS NOT NULL
      ) AS combined
      GROUP BY "userId"
      ORDER BY "lastMessageAt" DESC
    `);

    const users = await Promise.all(
      raw.map(async (item: any) => {
        try {
          const user = await this.usersService.findOne(item.userId);
          return {
            userId: item.userId,
            name: user?.name || `User #${item.userId}`,
            email: user?.email || '',
            lastMessageAt: item.lastMessageAt,
          };
        } catch {
          return {
            userId: item.userId,
            name: `User #${item.userId}`,
            email: '',
            lastMessageAt: item.lastMessageAt,
          };
        }
      }),
    );

    return users;
  }
}
