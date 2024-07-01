import {
  BadGatewayException,
  BadRequestException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { MS_PAYMENT } from 'src/utils/nameMicroservices';
import { ClientProxy } from '@nestjs/microservices';
import axios from 'axios';
import {
  API_DOLAR,
  INTERNAL_API_CANCEL,
  INTERNAL_API_SUCESS,
  USER_URL,
} from 'src/config/env';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/payment.entity';
import { stripe } from 'src/config/stripe.config';
import { Products } from './types/interfaces';

@Injectable()
export class PaymentService {
  constructor(
    @Inject(MS_PAYMENT) private client: ClientProxy,
    @InjectRepository(Order) private orderRepository: Repository<Order>,
  ) {}
  async create(createPaymentDto: CreatePaymentDto, token: string) {
    const response = await axios(`${USER_URL}/token`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status !== 200) throw new BadGatewayException(response.data);
    const priceTotal = createPaymentDto.products
      .map((product) => {
        return product.total;
      })
      .reduce((total, price) => total + price, 0);
    const ids = createPaymentDto.products.map((product) => product.id);

    if (response.status !== 200) throw new BadGatewayException(response.data);
    const order = this.orderRepository.create({
      user: response.data,
      products: createPaymentDto.products,
      price: priceTotal,
    });
    this.client.emit(
      { cmd: 'restStock' },
      {
        ids,
      },
    );
    const newOrder = await this.orderRepository.save(order);
    const url = await this.payment(createPaymentDto.products, newOrder.id);
    if (!url) {
      await this.orderRepository.delete(newOrder.id);
      this.client.emit(
        { cmd: 'newStock' },
        {
          ids,
        },
      );
      throw new BadRequestException('No se pudo realizar el pago');
    }
    return url;
  }
  truncateDescription(description: string, wordLimit: number): string {
    const words = description.split(' ');
    if (words.length <= wordLimit) {
      return description;
    }
    return words.slice(0, wordLimit).join(' ') + '...';
  }

  async payment(products: Products[], id: string) {
    const response = await axios(API_DOLAR);
    const dolar: number = response?.data?.compra || 1000;
    const line_items = products.map((product) => ({
      price_data: {
        product_data: {
          name: product.name,
          description: this.truncateDescription(product.description, 5),
          images: [product.image[0]],
        },
        currency: 'usd',
        unit_amount: (product.unitPrice / dolar) * 100,
      },
      quantity: product.quantity,
    }));
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      success_url: `${INTERNAL_API_SUCESS}/${id}`,
      cancel_url: `${INTERNAL_API_CANCEL}/${id}`,
    });

    return session.url;
  }
  async cancelPayment(id: string) {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) throw new BadRequestException('No se encontro el pedido');
    const ids = order.products.map((product: Products) => product.id);

    this.client.emit(
      { cmd: 'newStock' },
      {
        ids,
      },
    );
    await this.orderRepository.delete(id);
    return 'cancelado';
  }
}
