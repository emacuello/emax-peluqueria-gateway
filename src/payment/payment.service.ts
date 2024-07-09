import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { MS_PAYMENT } from 'src/utils/nameMicroservices';
import { ClientProxy } from '@nestjs/microservices';
import axios from 'axios';
import {
  API_DOLAR,
  INTERNAL_API_CANCEL,
  INTERNAL_API_SUCESS,
  SECRET_KEY,
  USER_URL,
} from 'src/config/env';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/payment.entity';
import { stripe } from 'src/config/stripe.config';
import { Products, UpdateStocks } from './types/interfaces';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/types/payload.jwt';

@Injectable()
export class PaymentService {
  constructor(
    @Inject(MS_PAYMENT) private client: ClientProxy,
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    private readonly jwtService: JwtService,
  ) {}
  async create(createPaymentDto: CreatePaymentDto, token: string) {
    console.log(token);

    try {
      console.log(USER_URL);

      const response = await axios(`${USER_URL}/users/token`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Si se algún dia aplico descuentos, no olvidarme de cambiar esto 👇
      const priceTotal = createPaymentDto.products
        .map((product) => {
          return product.price * product.quantity;
        })
        .reduce((total, price) => total + price, 0);
      console.log(priceTotal, createPaymentDto.total);

      if (priceTotal !== createPaymentDto.total)
        throw new BadRequestException('Los montos no coinciden');

      const order = this.orderRepository.create({
        user: response.data,
        products: createPaymentDto.products,
        price: priceTotal,
      });

      if (!order)
        throw new BadRequestException('No se pudo realizar el pago 1');

      const newOrder = await this.orderRepository.save(order);
      if (!newOrder)
        throw new BadRequestException('No se pudo realizar el pago 2');
      const url = await this.payment(createPaymentDto.products, newOrder.id);
      if (!url) {
        await this.orderRepository.delete(newOrder.id);
        throw new BadRequestException('No se pudo realizar el pago');
      }

      return url;
    } catch (error) {
      console.log(error);
    }
  }
  truncateDescription(description: string, wordLimit: number): string {
    const words = description.split(' ');
    if (words.length <= wordLimit) {
      return description;
    }
    return words.slice(0, wordLimit).join(' ') + '...';
  }

  async payment(products: Products[], id: string) {
    console.log('PRODUCTOS DENTRO DE STRIPE', products);

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
        unit_amount: Math.round((product.price / dolar) * 100),
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

    await this.orderRepository.update({ id }, { status: 'Cancelado' });
    return 'cancelado';
  }

  async sucessPayment(id: string) {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) throw new BadRequestException('No se encontro el pedido');
    await this.orderRepository.update({ id }, { status: 'Abonado' });
    const dataProducts: UpdateStocks[] = order.products.map((product) => ({
      products: [
        {
          _id: product._id,
          quantity: product.quantity,
        },
      ],
    }));
    this.client.emit({ cmd: 'restStock' }, dataProducts);
    this.client.emit({ cmd: 'createMailPayment' }, { order });
    return 'sucess';
  }
  async getPayment(currentUser?: string) {
    const payload: JwtPayload = await this.jwtService.verify(currentUser, {
      secret: SECRET_KEY,
    });
    if (!payload)
      throw new UnauthorizedException('No se pudo verificar el token');
    console.log(payload);
    const email = payload.aud;

    const order = await this.orderRepository
      .createQueryBuilder('order')
      .where(`"order"."user"->>'email' = :email`, { email })
      .orderBy('order.createdAt', 'DESC')
      .getMany();

    return order;
  }
  async getPaymentById() {
    const order = await this.orderRepository.find();
    return order;
  }
}
