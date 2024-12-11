import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { envs } from './common/envs.common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors();
  if (configService.get(envs.ENV) !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('BASE SASS BACKEND')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-swagger', app, document);
    console.log(
      'swagger api at: ',
      'http://localhost:' + configService.get(envs.PORT) + '/api-swagger',
    );
  }
  console.log('Server started on port: ' + configService.get(envs.PORT));
  console.log('ENV: ', configService.get(envs.ENV));
  await app.listen(configService.get(envs.PORT) ?? 3000);
}
bootstrap();
