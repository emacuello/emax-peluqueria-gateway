import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MS_PAYMENT } from 'src/utils/nameMicroservices';
import { HOST_REDIS, PASSWORD_REDIS, PORT_REDIS } from 'src/config/env';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/payment.entity';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MS_PAYMENT,
        transport: Transport.REDIS,
        options: {
          host: HOST_REDIS,
          port: Number(PORT_REDIS),
          password: PASSWORD_REDIS,
        },
      },
    ]),
    TypeOrmModule.forFeature([Order]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
