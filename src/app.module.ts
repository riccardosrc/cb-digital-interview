import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from './config/env';

@Module({
  imports: [ConfigModule.forRoot(configModuleOptions)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
