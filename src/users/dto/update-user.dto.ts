import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsString } from 'class-validator';
import { RegisterDto } from 'src/auth/dto/create-auth.dto';

export class UpdateUserAdmin extends PartialType(RegisterDto) {
  @IsString()
  image: string;
  @IsString()
  role: string;
  @IsBoolean()
  socialUser: boolean;
}
