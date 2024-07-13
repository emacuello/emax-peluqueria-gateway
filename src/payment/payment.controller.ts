import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Headers,
  Res,
  UnauthorizedException,
  BadRequestException,
  ParseUUIDPipe,
  Redirect,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Response } from 'express';
import { CANCEL_URL, SUCESS_URL } from 'src/config/env';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(ThrottlerGuard)
  async create(
    @Body() createPaymentDto: CreatePaymentDto,
    @Headers('Authorization') auth: string,
    @Res() res: Response,
  ) {
    const token = auth.split(' ')[1];
    if (!token) throw new UnauthorizedException('No se encontro el token');
    const url = await this.paymentService.create(createPaymentDto, token);
    if (!url) throw new BadRequestException('No se pudo realizar el pago');
    return res.json({ url });
  }

  @Get('cancel/:id')
  @Redirect()
  async cancelPayment(@Param('id', ParseUUIDPipe) id: string) {
    const response = await this.paymentService.cancelPayment(id);
    if (!response) throw new BadRequestException('No se pudo realizar el pago');
    return { url: `${CANCEL_URL}?id=${id}` };
  }
  @Get('sucess/:id')
  @Redirect()
  async sucess(@Param('id', ParseUUIDPipe) id: string) {
    const response = await this.paymentService.sucessPayment(id);
    if (!response) throw new BadRequestException('Ocurrio un error inesperado');
    return { url: `${SUCESS_URL}?id=${id}` };
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(ThrottlerGuard)
  async getPayment(@Headers('Authorization') token: string) {
    const currentUser = token?.split(' ')[1];
    if (!currentUser) throw new UnauthorizedException('No tienes permisos');
    return await this.paymentService.getPayment(currentUser);
  }
}
