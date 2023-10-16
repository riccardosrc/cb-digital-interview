import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { OpenapiModule } from './config/openapi/openapi.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // enable CORS
  app.enableCors();
  // get config instance
  const configService = app.get(ConfigService);
  // swagger setup
  OpenapiModule.setup(app, configService);
  // expose application on configured port
  const port = configService.get<number>('app.port');
  await app.listen(port);
}
bootstrap();
