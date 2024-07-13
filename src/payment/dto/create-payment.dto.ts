import { IsArray, IsNumber } from 'class-validator';
import { Products } from '../types/interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @IsArray()
  @ApiProperty({
    description: 'Lista de productos',
    example: [
      {
        _id: 'example',
        name: 'example',
        price: 123,
        totalPrice: 123,
        description: 'example',
        image: ['example.jpg', 'example.jpg'],
        stock: 123,
        offerprice: 123,
        offer: true,
        quantity: 123,
        __v: 123,
        total: 123,
      },
    ],
  })
  products: Products[];
  @IsNumber()
  @ApiProperty({ description: 'Precio total de la compra', example: 123 })
  total: number;
}
