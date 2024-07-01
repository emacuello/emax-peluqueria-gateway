import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UpdateAuthDto } from 'src/auth/dto/update-auth.dto';
import { MS_USERS } from 'src/utils/nameMicroservices';
import { FileUploadService } from './cloudinary.service';
import axios from 'axios';
import { USER_URL } from 'src/config/env';

@Injectable()
export class UsersService {
  constructor(
    @Inject(MS_USERS) private client: ClientProxy,
    private fileUploadService: FileUploadService,
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
    const response = await axios.put(`${USER_URL}/users`, update, {
      headers: { Authorization: token },
    });
    if (response.status === 200 || response.status === 201) {
      return 'Usuario actualizado correctamente';
    }
    throw new BadGatewayException(response.data);
  }
}
