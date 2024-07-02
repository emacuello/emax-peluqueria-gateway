import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  Headers,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateAuthDto } from 'src/auth/dto/update-auth.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('profile')
  @UseInterceptors(FileInterceptor('file'))
  changeProfile(
    @Body() update: UpdateAuthDto,
    @Headers('Authorization') token: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1000000,
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
    return this.usersService.changeProfile(update, currentUser, file);
  }

  @Get()
  getAllUsers(@Headers('Authorization') token: string) {
    const currentUser = token?.split(' ')[1];
    if (!currentUser) throw new UnauthorizedException('No tienes permisos');
    return this.usersService.getAllUsers(currentUser);
  }

  @Get('token')
  getToken(@Headers('Authorization') token: string) {
    console.log(token);

    const currentUser = token?.split(' ')[1];
    if (!currentUser) throw new UnauthorizedException('No tienes permisos');
    return this.usersService.getToken(currentUser);
  }
}
