import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  login(@Body() createAuthDto: LoginDto) {
    return this.authService.login(createAuthDto);
  }
  @Post()
  register(@Body() createAuthDto: RegisterDto) {
    return this.authService.register(createAuthDto);
  }
}
