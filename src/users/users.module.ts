import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MS_USERS } from 'src/utils/nameMicroservices';
import {
  HOST_REDIS,
  PASSWORD_REDIS,
  PORT_REDIS,
  USERNAME_REDIS,
} from 'src/config/env';
import { FileUploadService } from './cloudinary.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MS_USERS,
        transport: Transport.REDIS,
        options: {
          host: HOST_REDIS,
          port: Number(PORT_REDIS),
          username: USERNAME_REDIS,
          password: PASSWORD_REDIS,
        },
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, FileUploadService],
})
export class UsersModule {}
