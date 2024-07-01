import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Redirect,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/create-auth.dto';
import { GoogleAuthGuard } from './guards/auth.guard';
import { GOOGLE_REDIRECT_FRONT, LOGIN_URL } from 'src/config/env';
import { GoogleStrategy } from './utils/GoogleStrategy';
import { ReqUser } from './types/typesGoogle';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private googleStrategy: GoogleStrategy,
  ) {}

  @Post()
  login(@Body() createAuthDto: LoginDto) {
    return this.authService.login(createAuthDto);
  }
  @Post()
  register(@Body() createAuthDto: RegisterDto) {
    return this.authService.register(createAuthDto);
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
    return { url: `${GOOGLE_REDIRECT_FRONT}?token=${createUser}` };
  }
}
