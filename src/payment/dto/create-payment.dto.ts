import { IsArray, IsNumber } from 'class-validator';
import { Products } from '../types/interfaces';

export class CreatePaymentDto {
  @IsArray()
  products: Products[];
  @IsNumber()
  total: number;
}
