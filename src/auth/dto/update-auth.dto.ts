import { PartialType } from '@nestjs/mapped-types';
import { RegisterDto } from './create-auth.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAuthDto extends PartialType(RegisterDto) {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'image', example: 'image.jpg' })
  image: string;
}
