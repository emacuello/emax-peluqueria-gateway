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
import { CloudinaryConfig } from 'src/config/cloudinary.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/payment/entities/payment.entity';
import { ThrottlerModule } from '@nestjs/throttler';

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
    TypeOrmModule.forFeature([Order]),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 5,
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, FileUploadService, CloudinaryConfig],
})
export class UsersModule {}
