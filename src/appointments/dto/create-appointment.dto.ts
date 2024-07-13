import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  @ApiProperty({ description: 'Fecha del turno', example: '2022-01-01' })
  date: string;
  @IsString()
  @ApiProperty({ description: 'Hora del turno', example: '10:00' })
  time: string;
  @IsString()
  @ApiProperty({
    description: 'Descripción del turno',
    example: 'Corte de pelo',
  })
  description: string;
  @IsNumber()
  @ApiProperty({ description: 'ID del usuario', example: 1 })
  userid: number;
}
