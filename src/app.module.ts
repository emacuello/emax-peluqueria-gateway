import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { PaymentModule } from './payment/payment.module';
import { ConfigModuleRoot } from './config/config.module';
import { ConfigTypOrmModule } from './config/typeorm.module';
import { PassportModule } from '@nestjs/passport';
import { JwtConfigModule } from './config/jwt.module';
import { AppointmentsModule } from './appointments/appointments.module';

@Module({
  imports: [
    ConfigModuleRoot,
    ConfigTypOrmModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    PaymentModule,
    PassportModule.register({ session: true }),
    JwtConfigModule,
    AppointmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
