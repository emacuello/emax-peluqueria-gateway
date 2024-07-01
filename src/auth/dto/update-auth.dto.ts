import { PartialType } from '@nestjs/mapped-types';
import { RegisterDto } from './create-auth.dto';
import { IsString } from 'class-validator';

export class UpdateAuthDto extends PartialType(RegisterDto) {
  @IsString()
  image: string;
}
