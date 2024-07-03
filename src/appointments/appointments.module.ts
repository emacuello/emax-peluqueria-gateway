import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MS_APPOINTMENT } from 'src/utils/nameMicroservices';
import {
  HOST_REDIS,
  PASSWORD_REDIS,
  PORT_REDIS,
  USERNAME_REDIS,
} from 'src/config/env';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MS_APPOINTMENT,
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
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}
