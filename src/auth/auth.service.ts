import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  ChangePasswordDto,
  LoginDto,
  RegisterDto,
} from './dto/create-auth.dto';
import { MS_AUTH } from 'src/utils/nameMicroservices';
import { ClientProxy } from '@nestjs/microservices';
import axios from 'axios';
import { HEADERS_TOKEN, SECRET_KEY, USER_URL } from 'src/config/env';
import { PayloadGoogleType } from './types/typesGoogle';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './types/payload.jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Auth } from './entities/auth.entity';
import { Repository } from 'typeorm';
import { User } from 'src/payment/types/interfaces';

@Injectable()
export class AuthService {
  constructor(
    @Inject(MS_AUTH) private authClient: ClientProxy,
    private jwtService: JwtService,
    @InjectRepository(Auth) private authRepository: Repository<Auth>,
  ) {}

  async serverLogin(createAuthDto: LoginDto) {
    const user = await this.authRepository.findOneBy({
      username: createAuthDto.username,
    });
    console.log('USER encontrado en server o no?', user);

    if (!user) {
      console.log('entroooo');

      return await this.login(createAuthDto);
    }
    const comparePassword = await bcrypt.compare(
      createAuthDto.password,
      user.password,
    );
    if (!comparePassword)
      throw new BadRequestException('Credenciales inválidas');

    const payload: JwtPayload = {
      sub: user.id,
      role: user.role,
      aud: user.email,
    };
    const token = this.jwtService.sign(payload);
    if (!token) throw new BadRequestException('Credenciales inválidas');
    return token;
  }
  async login(createAuthDto: LoginDto) {
    try {
      const response = await axios.post(
        `${USER_URL}/users/login`,
        createAuthDto,
        {
          headers: {
            Authorization: `Bearer ${HEADERS_TOKEN}`,
          },
        },
      );
      console.log('si entro entonces el problema es express');

      return response.data;
    } catch (error) {
      throw new BadRequestException(error.response.data);
    }
  }
  async register(registerDto: RegisterDto) {
    try {
      const response = await axios.post(
        `${USER_URL}/users/register`,
        registerDto,
        {
          headers: {
            Authorization: `Bearer ${HEADERS_TOKEN}`,
          },
        },
      );
      this.authClient.emit('createMailWelcome', {
        email: registerDto.email,
        name: registerDto.name,
      });
      return response.data;
    } catch (error) {
      throw new BadRequestException(error.response.data.message);
    }
  }
  async findUser(mail: string) {
    console.log('EMAIL EN EL SERIALIZER', mail);

    try {
      if (mail === null) return null;
      const response = await axios(`${USER_URL}/users/mail`, {
        headers: {
          Authorization: `Bearer ${HEADERS_TOKEN}`,
          Email: mail,
        },
      });

      return response.data;
    } catch (error) {
      console.log('ERROR EN LA BUSQUEDA DEL SERIALIZER', error);
      return null;
    }
  }
  async googleLogin(userPayload: PayloadGoogleType) {
    let token;
    try {
      const user = await axios(`${USER_URL}/users/mail`, {
        headers: {
          Authorization: `Bearer ${HEADERS_TOKEN}`,
          Email: userPayload.email,
        },
      });

      const payload: JwtPayload = {
        sub: user.data.id,
        role: user.data.role,
        aud: user.data.email,
      };
      token = this.jwtService.sign(payload);
    } catch (error) {
      token = await this.googleRegister(userPayload);
      if (!token) throw new BadRequestException(error.response.data.message);
    }
    return token;
  }

  async googleRegister(userPayload: PayloadGoogleType) {
    try {
      const newUser = {
        name: userPayload.name,
        email: userPayload.email,
        image: userPayload.image_url,
      };
      const axiosResponse = await axios.post(
        `${USER_URL}/users/register/google`,
        newUser,
      );
      console.log('AXIOS RESPONSE', axiosResponse.data);

      const payload: JwtPayload = {
        sub: axiosResponse.data.id,
        role: axiosResponse.data.role,
        aud: axiosResponse.data.email,
      };
      this.authClient.emit(
        { cmd: 'createMailWelcome' },
        {
          email: newUser.email,
          name: newUser.name,
        },
      );
      return this.jwtService.sign(payload);
    } catch (error) {
      throw new BadRequestException(error.response.data.message);
    }
  }
  async sendmail() {
    this.authClient.emit(
      { cmd: 'createMailWelcome' },
      {
        email: 'ema.cuello1010@gmail.com',
        name: 'emacuello',
      },
    );

    return 'Enviado';
  }
  async changePassword(data: ChangePasswordDto, token: string) {
    if (data.socialUser) {
      const { oldPassword, newPassword } = data;
      const tokenDecoded: JwtPayload = this.jwtService.verify(token, {
        secret: SECRET_KEY,
      });
      const user = await this.authRepository.findOne({
        where: {
          email: tokenDecoded.aud,
        },
      });
      if (!user) {
        return await this.createUserServer(data, token);
      }

      const isValidPassword = await bcrypt.compare(oldPassword, user.password);
      if (!isValidPassword) {
        throw new BadRequestException('Las contraseñas no coinciden');
      }

      user.password = await bcrypt.hash(newPassword, 10);
      await this.authRepository.save(user);
      return { message: 'Contraseña actualizada' };
    } else {
      try {
        const { oldPassword, newPassword } = data;
        const response = await axios.put(
          `${USER_URL}/users/changePassword`,
          {
            oldPassword,
            newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        return response.data;
      } catch (error) {
        throw new BadRequestException(error.response.data.message);
      }
    }
  }

  async createUserServer(data: ChangePasswordDto, token: string) {
    const { newPassword, username } = data;
    try {
      const response = await axios(`${USER_URL}/users/token`, {
        headers: { Authorization: `Bearer: ${token}` },
      });
      const user = response.data as User;
      const createUserServer = await this.authRepository.save({
        username,
        password: await bcrypt.hash(newPassword, 10),
        email: user.email,
        role: user.role,
      });
      if (!createUserServer)
        throw new BadRequestException('Error al crear el usuario');
      await axios.put(
        `${USER_URL}/users`,
        { serverPrincipal: true },
        {
          headers: { Authorization: `Bearer: ${token}` },
        },
      );
      return { message: 'Contraseña actualizada' };
    } catch (error) {
      throw new BadRequestException(error.response.data.message);
    }
  }
}
