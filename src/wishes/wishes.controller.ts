import { 
  Controller, Get, Post, Patch, Delete, Body, Param, Req, ParseIntPipe, NotFoundException, UseGuards, UsePipes, ValidationPipe 
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWhishDto } from './dto/create-wishes.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('wishes')
@UseGuards(AuthGuard('jwt'))
export class WishesController {
  constructor(
    private readonly wishesService: WishesService,
    private readonly prisma: PrismaService,
  ) {}

  /** Получение всех желаний пользователя */
  @Get()
  async getAll(@Req() req) {
    return this.wishesService.findAll(req.user.userId, req.user.role);
  }

  /** Получение конкретного желания по ID */
  @Get(':id')
  async getOne(@Param('id') id: string) {
    const wishId = parseInt(id, 10);
    return this.wishesService.findOne(wishId);
  }

  /** Создание нового желания */
  @Post()
  async create(@Req() req, @Body() dto: CreateWhishDto) {
    return this.wishesService.create(req.user.userId, dto);
  }

  /** Обновление желания */
  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateWishDto,
    @Req() req: any,
  ) {
    const wish = await this.findUserWishOrFail(id, req.user.userId);

    return this.prisma.wish.update({
      where: { id },
      data: { ...updateDto, updatedAt: new Date() },
      include: {
        user: { select: { email: true, name: true } },
      },
    });
  }

  /** Удаление желания */
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    await this.findUserWishOrFail(id, req.user.userId);
    return this.wishesService.delete(id);
  }

  /** Вспомогательный метод: проверка существования и принадлежности желания пользователю */
  private async findUserWishOrFail(id: number, userId: number) {
    const wish = await this.prisma.wish.findFirst({
      where: { id, userId },
    });

    if (!wish) {
      throw new NotFoundException('Желание не найдено');
    }
    return wish;
  }
}
