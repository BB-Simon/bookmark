import { Controller, Get, UseGuards } from '@nestjs/common';
import { getUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  @Get('me')
  getMe (@getUser() user: User, @getUser('email') email: string) {
    console.log({
      email,
    });

    return user;
  }
}
