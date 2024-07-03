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

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @UseGuards(ThrottlerGuard)
  create(
    @Body() createPaymentDto: CreatePaymentDto,
    @Headers('Authorization') auth: string,
    @Res() res: Response,
  ) {
    const token = auth.split(' ')[1];
    if (!token) throw new UnauthorizedException('No se encontro el token');
    const url = this.paymentService.create(createPaymentDto, token);
    if (!url) throw new BadRequestException('No se pudo realizar el pago');
    return res.json({ url });
  }

  @Get('cancel/:id')
  @Redirect()
  cancelPayment(@Param('id', ParseUUIDPipe) id: string) {
    const response = this.paymentService.cancelPayment(id);
    if (!response) throw new BadRequestException('No se pudo realizar el pago');
    return { url: CANCEL_URL };
  }
  @Get('sucess/:id')
  @Redirect()
  sucess(@Param('id') id: string) {
    const response = this.paymentService.sucessPayment(id);
    if (!response) throw new BadRequestException('Ocurrio un error inesperado');
    const SUCCES_CHECK_URL = process.env.SUCCES_CHECK_URL;
    if (SUCCES_CHECK_URL) return { url: SUCESS_URL };
  }
  @Get('mockmail')
  mockmail() {
    return this.paymentService.mockmail();
  }
}
