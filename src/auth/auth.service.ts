import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(dto: AuthDto) {
    try {
      // Generate the password hash
      const hash = await argon.hash(dto.password);
      // Save the nwe user in the DB
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },

        // Return only these specefic fields
        // select: {
        //   id: true,
        //   email: true,
        //   createdAt: true,
        // },
      });

      // delete the hash and don't return it
      delete user.hash;
      // Return the saved user
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken!');
        }
      }
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    // Find the user with email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    // If not found throw an exception
    if (!user) {
      throw new ForbiddenException('Credevtials incorrect!');
    }

    // Match the password
    const match = await argon.verify(user.hash, dto.password);
    // If not match throw an exception
    if (!match) {
      throw new ForbiddenException('Credevtials incorrect!');
    }

    delete user.hash;
    // Send back the user
    return user;
  }
}
