import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { PaymentModule } from './payment/payment.module';
import { ConfigModuleRoot } from './config/config.module';
import { ConfigTypOrmModule } from './config/typeorm.module';

@Module({
  imports: [
    ConfigModuleRoot,
    ConfigTypOrmModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
