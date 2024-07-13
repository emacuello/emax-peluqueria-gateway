import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Redirect,
  Req,
  Headers,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  RegisterDto,
  LoginDto,
  ChangePasswordDto,
} from './dto/create-auth.dto';
import { GoogleAuthGuard } from './guards/auth.guard';
import { GOOGLE_REDIRECT_FRONT, LOGIN_URL } from 'src/config/env';
import { GoogleStrategy } from './utils/GoogleStrategy';
import { ReqUser } from './types/typesGoogle';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private googleStrategy: GoogleStrategy,
  ) {}

  @Post('login')
  async login(@Body() createAuthDto: LoginDto) {
    console.log('createAuthDto', createAuthDto);

    return await this.authService.login(createAuthDto);
  }
  @Post('register')
  async register(@Body() createAuthDto: RegisterDto) {
    return await this.authService.register(createAuthDto);
  }

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  handleLogin() {
    return { msg: 'Google Authentication' };
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  @Redirect()
  async handleRedirect(@Req() req: Request) {
    const { user } = <any>req;
    const { payload } = user as ReqUser;
    const createUser = await this.authService.googleLogin(payload);
    if (!createUser) {
      return { url: LOGIN_URL };
    }
    console.log('createUser', createUser);

    return { url: `${GOOGLE_REDIRECT_FRONT}?token=${createUser}` };
  }

  @Put('changePassword')
  @ApiBearerAuth()
  async changePassword(
    @Body() data: ChangePasswordDto,
    @Headers('Authorization') auth: string,
  ) {
    const token = auth.split(' ')[1];
    if (!token) throw new UnauthorizedException('No se encontro el token');
    return await this.authService.changePassword(data, token);
  }
}
