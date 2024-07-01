import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MS_AUTH } from 'src/utils/nameMicroservices';
import {
  HOST_REDIS,
  PASSWORD_REDIS,
  PORT_REDIS,
  USERNAME_REDIS,
} from 'src/config/env';
import { GoogleStrategy } from './utils/GoogleStrategy';
import { SessionSerializer } from './utils/serializer';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MS_AUTH,
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
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, SessionSerializer],
})
export class AuthModule {}
