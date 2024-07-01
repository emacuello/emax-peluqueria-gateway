import { IsArray } from 'class-validator';
import { Products } from '../types/interfaces';

export class CreatePaymentDto {
  @IsArray()
  products: Products[];
}
