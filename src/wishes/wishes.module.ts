import { Module } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { WishesController } from './wishes.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';

@Module({
   imports: [
      JwtModule,
      PrismaModule,
      PassportModule,
    ],
  controllers: [WishesController],
  providers: [WishesService],
})
export class WishesModule {}
