import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

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

  await app.listen(3000);
}
bootstrap();
