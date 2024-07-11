import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UpdateAuthDto } from 'src/auth/dto/update-auth.dto';
import { MS_USERS } from 'src/utils/nameMicroservices';
import { FileUploadService } from './cloudinary.service';
import axios from 'axios';
import { HEADERS_TOKEN, USER_URL } from 'src/config/env';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from 'src/auth/entities/auth.entity';
import { Repository } from 'typeorm';
import { Order } from 'src/payment/entities/payment.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject(MS_USERS) private client: ClientProxy,
    private fileUploadService: FileUploadService,
    @InjectRepository(Auth) private authRepository: Repository<Auth>,
    @InjectRepository(Order) private paymentRepository: Repository<Order>,
  ) {}
  async changeProfile(
    update: UpdateAuthDto,
    token: string,
    file?: Express.Multer.File,
  ) {
    if (file) {
      const cloudinary = await this.fileUploadService.uploadStream(file);
      update.image = cloudinary.secure_url;
    }
    try {
      const response = await axios.put(`${USER_URL}/users`, update, {
        headers: { Authorization: `Bearer: ${token}` },
      });
      console.log('RESPONSE', response.data);
      return response.data;
    } catch (error) {
      throw new BadRequestException(error.response.data);
    }
  }
  async getAllUsers(token: string) {
    try {
      const response = await axios(`${USER_URL}/users`, {
        headers: { Authorization: `Bearer: ${token}` },
      });
      return response.data;
    } catch (error) {
      throw new BadRequestException(error.response.data);
    }
  }
  async getToken(token: string) {
    try {
      const response = await axios(`${USER_URL}/users/token`, {
        headers: { Authorization: `Bearer: ${token}` },
      });
      return response.data;
    } catch (error) {
      throw new BadRequestException(error.response.data);
    }
  }
  async deleteUser(token: string) {
    try {
      const response = await axios.delete(`${USER_URL}/users`, {
        headers: { Authorization: `Bearer: ${token}` },
      });
      this.paymentRepository
        .createQueryBuilder('order')
        .where(`"order"."user"->>'email' = :email`, {
          email: response.data.email,
        })
        .orderBy('order.createdAt', 'DESC')
        .getMany()
        .then((order) => {
          if (order?.length > 0) {
            const ids = order.map((order) => order.id);
            for (const id of ids) {
              this.paymentRepository
                .delete(id)
                .catch((err) => console.log(err));
            }
          }
        })
        .catch((err) => console.log(err));
      if (response.data.serverPrincipal) {
        await this.authRepository.delete({ email: response.data.email });
      }
      return 'Usuario eliminado';
    } catch (error) {
      throw new BadRequestException(error.response.data);
    }
  }
  async getUsername() {
    try {
      const response = await axios(`${USER_URL}/users/username`, {
        headers: { Authorization: `Bearer: ${HEADERS_TOKEN}` },
      });
      const usernames = await this.authRepository.find();
      const notAvailableUsernames: string[] = response.data;
      if (usernames?.length > 0) {
        const usernamesServer = usernames.map((user) => user.username);
        notAvailableUsernames.push(...usernamesServer);
      }
      return notAvailableUsernames;
    } catch (error) {
      throw new BadRequestException(error.response.data);
    }
  }
}
