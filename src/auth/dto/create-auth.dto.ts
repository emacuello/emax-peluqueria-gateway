import { PickType } from '@nestjs/mapped-types';
import { IsEmail, IsNumber, IsString } from 'class-validator';

export class RegisterDto {
  @IsString()
  name: string;
  @IsString()
  @IsEmail()
  email: string;
  @IsString()
  birthdate: string;
  @IsNumber()
  nDni: number;
  @IsString()
  username: string;
  @IsString()
  password: string;
}
export class LoginDto extends PickType(RegisterDto, ['username', 'password']) {}
