import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto/create-auth.dto';
import { MS_AUTH } from 'src/utils/nameMicroservices';
import { ClientProxy } from '@nestjs/microservices';
import axios from 'axios';
import { USER_URL } from 'src/config/env';

@Injectable()
export class AuthService {
  constructor(@Inject(MS_AUTH) private authClient: ClientProxy) {}
  async login(createAuthDto: LoginDto) {
    const response = await axios.post(`${USER_URL}/users/login`, createAuthDto);
    if (response.status === 200 || response.status === 201) {
      return response.data;
    }
    throw new BadGatewayException('Error al iniciar sesión');
  }
  async register(registerDto: RegisterDto) {
    const response = await axios.post(
      `${USER_URL}/users/register`,
      registerDto,
    );
    if (response.status === 200 || response.status === 201) {
      return response.data;
    }
    throw new BadGatewayException('Error al registrar usuario');
  }
}
