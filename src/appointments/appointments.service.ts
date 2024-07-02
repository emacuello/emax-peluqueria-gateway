import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import axios from 'axios';
import { USER_URL } from 'src/config/env';

@Injectable()
export class AppointmentsService {
  async create(createAppointmentDto: CreateAppointmentDto, token: string) {
    try {
      const response = await axios.post(
        `${USER_URL}/appointment/schedule`,
        createAppointmentDto,
        {
          headers: { Authorization: `Bearer: ${token}` },
        },
      );

      return response.data;
    } catch (error) {
      throw new BadRequestException(error.response.data);
    }
  }

  async findAll(token: string) {
    try {
      const response = await axios(`${USER_URL}/appointments`, {
        headers: { Authorization: `Bearer: ${token}` },
      });

      return response.data;
    } catch (error) {
      throw new BadRequestException(error.response.data);
    }
  }

  async findOne(id: number, token: string) {
    try {
      const response = await axios(`${USER_URL}/appointment/${id}`, {
        headers: { Authorization: `Bearer: ${token}` },
      });
      return response.data;
    } catch (error) {
      throw new BadRequestException(error.response.data);
    }
  }

  async update(
    id: number,
    updateAppointmentDto: UpdateAppointmentDto,
    token: string,
  ) {
    try {
      const response = await axios.put(
        `${USER_URL}/appointment/cancel/${id}`,
        updateAppointmentDto,
        {
          headers: { Authorization: `Bearer: ${token}` },
        },
      );

      return response.data;
    } catch (error) {
      throw new BadRequestException(error.response.data);
    }
  }
}
