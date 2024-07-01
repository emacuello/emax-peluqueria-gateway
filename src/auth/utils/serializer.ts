/* eslint-disable @typescript-eslint/ban-types */
import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from '../auth.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly authService: AuthService) {
    super();
  }
  serializeUser(user: any, done: Function) {
    done(null, user);
  }
  async deserializeUser(payload: any, done: Function) {
    console.log('PAYLOAD DEL SERIALIZAR', payload);
    const user = await this.authService.findUser(payload.email);
    return user ? done(null, user) : done(null, null);
  }
}
