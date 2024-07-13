import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Headers,
  UnauthorizedException,
  Put,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @ApiBearerAuth()
  async create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @Headers('Authorization') token: string,
  ) {
    const currentUser = token?.split(' ')[1];
    if (!currentUser) throw new UnauthorizedException('No tienes permisos');
    return await this.appointmentsService.create(
      createAppointmentDto,
      currentUser,
    );
  }

  @Get()
  @ApiBearerAuth()
  async findAll(@Headers('Authorization') token: string) {
    const currentUser = token?.split(' ')[1];
    if (!currentUser) throw new UnauthorizedException('No tienes permisos');
    return await this.appointmentsService.findAll(currentUser);
  }

  @Get(':id')
  @ApiBearerAuth()
  async findOne(
    @Param('id') id: string,
    @Headers('Authorization') token: string,
  ) {
    const currentUser = token?.split(' ')[1];
    return await this.appointmentsService.findOne(Number(id), currentUser);
  }

  @Put(':id')
  @ApiBearerAuth()
  async update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
    @Headers('Authorization') token: string,
  ) {
    const currentUser = token?.split(' ')[1];
    if (!currentUser) throw new UnauthorizedException('No tienes permisos');
    return await this.appointmentsService.update(
      Number(id),
      updateAppointmentDto,
      currentUser,
    );
  }
}
