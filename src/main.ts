import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT, SESSION_SECRET } from './config/env';
import { ValidationPipe } from '@nestjs/common';
import * as passport from 'passport';
import * as session from 'express-session';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.use(
    session({
      secret: SESSION_SECRET,
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 60000,
      },
    }),
  );
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Emax Peluqueria')
    .setDescription(
      'Emax Peluqueria Api Gateway, es el punto de entrada de la aplicación backend',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(PORT);
}
bootstrap();
