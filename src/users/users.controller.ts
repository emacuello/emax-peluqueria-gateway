import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Headers,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateAuthDto } from 'src/auth/dto/update-auth.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('profile')
  @UseInterceptors(FileInterceptor('file'))
  async changeProfile(
    @Body() update: UpdateAuthDto,
    @Headers('Authorization') token: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 5000000,
            message: 'El archivo es demasiado grande',
          }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp)$/,
          }),
        ],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {
    const currentUser = token?.split(' ')[1];

    return await this.usersService.changeProfile(update, currentUser, file);
  }

  @Get()
  async getAllUsers(@Headers('Authorization') token: string) {
    const currentUser = token?.split(' ')[1];
    if (!currentUser) throw new UnauthorizedException('No tienes permisos');
    return await this.usersService.getAllUsers(currentUser);
  }
  @Get('username')
  @UseGuards(ThrottlerGuard)
  async getUsername() {
    return await this.usersService.getUsername();
  }
  @Get('token')
  async getToken(@Headers('Authorization') token: string) {
    console.log(token);

    const currentUser = token?.split(' ')[1];
    if (!currentUser) throw new UnauthorizedException('No tienes permisos');
    return await this.usersService.getToken(currentUser);
  }

  @Delete()
  async deleteUser(@Headers('Authorization') token: string) {
    const currentUser = token?.split(' ')[1];
    if (!currentUser) throw new UnauthorizedException('No tienes permisos');
    return await this.usersService.deleteUser(currentUser);
  }
}
