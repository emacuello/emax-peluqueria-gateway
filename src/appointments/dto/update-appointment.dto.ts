import { PartialType } from '@nestjs/mapped-types';
import { CreateAppointmentDto } from './create-appointment.dto';
import { IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
  @IsString()
  @ApiPropertyOptional({
    description: 'Estado del turno',
    example: 'active',
  })
  status: string;
}
