import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWhishDto } from './dto/create-wishes.dto';

@Injectable()
export class WishesService {
  constructor(private readonly prisma: PrismaService) {}

  /** Получение всех желаний пользователя или всех желаний для админа */
  async findAll(userId: number, role: string) {
    return role === 'ADMIN'
      ? this.prisma.wish.findMany()
      : this.prisma.wish.findMany({
          where: { userId },
          include: { user: true },
        });
  }

  /** Получение одного желания по id */
  async findOne(id: number) {
    const wish = await this.prisma.wish.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    if (!wish) throw new NotFoundException(`Желание с id ${id} не найдено`);
    return wish;
  }

  /** Создание нового желания */
  async create(userId: number, dto: CreateWhishDto) {
    return this.prisma.wish.create({
      data: { ...dto, userId },
    });
  }

  /** Удаление желания по id */
  async delete(id: number) {
    const wish = await this.prisma.wish.findUnique({ where: { id } });
    if (!wish) throw new NotFoundException(`Желание с id ${id} не найдено`);

    return this.prisma.wish.delete({ where: { id } });
  }
}
