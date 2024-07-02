import { IsNumber, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  date: string;
  @IsString()
  time: string;
  @IsString()
  description: string;
  @IsNumber()
  userid: number;
}
