import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  async findAll() {
    return `This action returns all users`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} user`;
  }
  async findbyToken() {}
}
