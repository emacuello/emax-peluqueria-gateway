import { Inject, Injectable } from '@nestjs/common';
import { MS_PRODUCTS } from 'src/utils/nameMicroservices';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ProductsService {
  constructor(@Inject(MS_PRODUCTS) private client: ClientProxy) {}

  findAll() {
    return this.client.send({ cmd: 'findAllProducts' }, {});
  }

  async findOne(id: string) {
    return this.client.send({ cmd: 'findOneProduct' }, { id });
  }
}
