import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  async login(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }
  async register(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }
}
