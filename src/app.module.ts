import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configModuleOptions } from './config/env';
import { mongooseOptions } from './config/database';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    MongooseModule.forRootAsync(mongooseOptions),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
