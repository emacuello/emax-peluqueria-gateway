import { BadRequestException } from '@nestjs/common';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
  Matches,
  Validate,
} from 'class-validator';
import { ComparePassword } from '../decorators/comparePass.decorator';

export class RegisterDto {
  @IsString()
  @ApiProperty({ description: 'Nombre del usuario', example: 'Pepito' })
  name: string;
  @IsString()
  @IsEmail()
  @ApiProperty({
    description: 'Email del usuario',
    example: 'qJt7O@example.com',
  })
  email: string;
  @IsString()
  @ApiProperty({ description: 'Fecha de nacimiento', example: '2022-01-01' })
  birthdate: string;
  @IsNumber()
  @ApiProperty({ description: 'DNI del usuario', example: '12345678' })
  @Transform(({ value }) => {
    if (typeof value === 'number') {
      return value;
    }
    const transformedValue = Number(value);
    if (isNaN(transformedValue)) {
      throw new BadRequestException('El valor no es numero');
    }
    return transformedValue;
  })
  nDni: number;
  @IsString()
  @ApiProperty({ description: 'Username del usuario', example: 'pepito' })
  username: string;
  @IsString()
  @ApiProperty({
    description:
      'Contraseña del usuario, minimo 8 caracteres, maximo 15, al menos una mayuscula, una minuscula, un numero y un caracter especial',
    example: '123.Example',
  })
  @IsNotEmpty()
  @Length(8, 15)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&.,_-])([A-Za-z\d$@$!%*?&.,_-]|[^ ]){8,15}$/,
  )
  @IsStrongPassword({
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;
}
export class LoginDto extends PickType(RegisterDto, ['username', 'password']) {}

export class ChangePasswordDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(8, 15)
  @ApiProperty({
    description:
      'Contraseña actual del usuario, minimo 8 caracteres, maximo 15, al menos una mayuscula, una minuscula, un numero y un caracter especial',
    example: '123.Example',
  })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&.,_-])([A-Za-z\d$@$!%*?&.,_-]|[^ ]){8,15}$/,
  )
  @IsStrongPassword({
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  oldPassword: string;
  @IsString()
  @IsNotEmpty()
  @Length(8, 15)
  @ApiProperty({
    description:
      'Nueva contraseña del usuario, minimo 8 caracteres, maximo 15, al menos una mayuscula, una minuscula, un numero y un caracter especial',
    example: '123.Example',
  })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&.,_-])([A-Za-z\d$@$!%*?&.,_-]|[^ ]){8,15}$/,
  )
  @IsStrongPassword({
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  newPassword: string;
  @IsString()
  @ApiProperty({
    description: 'Confirmar nueva contraseña',
    example: '123.Example',
  })
  @Validate(ComparePassword, ['newPassword'])
  confirmPassword: string;
}
