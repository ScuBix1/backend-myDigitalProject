import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import 'dotenv/config';
import * as express from 'express';
import { writeFileSync } from 'fs';
import * as yaml from 'js-yaml';
import {
  I18nValidationExceptionFilter,
  i18nValidationErrorFactory,
} from 'nestjs-i18n';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use('/stripe/webhook', bodyParser.raw({ type: 'application/json' }));

  app.enableCors({
    origin: [process.env.REMOTE_ORIGIN, process.env.LOCAL_ORIGIN],
    credentials: true,
  });
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: i18nValidationErrorFactory,
    }),
  );

  app.useGlobalFilters(new I18nValidationExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Math&Magique')
    .setDescription("Description de l'API de Math&Magique")
    .setVersion('1.0')
    .addTag('Maths')
    .build();

  const documentFactory = SwaggerModule.createDocument(app, config);

  if (documentFactory) {
    writeFileSync('./swagger.json', JSON.stringify(documentFactory, null, 2));
    writeFileSync('./swagger.yaml', yaml.dump(documentFactory));
  } else {
    console.error(
      'Erreur : `document` est undefined, vérifie la configuration Swagger.',
    );
  }

  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
void bootstrap();
