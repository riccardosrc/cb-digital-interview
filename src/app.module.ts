import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { configModuleOptions } from './config/env';
import { mongooseOptions } from './config/database';
import { PlayersModule } from './modules/players/players.module';
import { ScraperModule } from './modules/scraper/scraper.module';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    MongooseModule.forRootAsync(mongooseOptions),
    PlayersModule,
    ScraperModule,
  ],
  providers: [
    { provide: APP_PIPE, useValue: new ValidationPipe({ transform: true }) },
  ],
})
export class AppModule {}
