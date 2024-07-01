import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MS_PRODUCTS } from 'src/utils/nameMicroservices';
import { HOST_REDIS, PASSWORD_REDIS, PORT_REDIS } from 'src/config/env';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MS_PRODUCTS,
        transport: Transport.REDIS,
        options: {
          host: HOST_REDIS,
          port: Number(PORT_REDIS),
          password: PASSWORD_REDIS,
        },
      },
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
