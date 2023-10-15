import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configModuleOptions } from './config/env';
import { mongooseOptions } from './config/database';
import { PlayersModule } from './modules/players/players.module';
import { ScraperModule } from './modules/scraper/scraper.module';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    MongooseModule.forRootAsync(mongooseOptions),
    PlayersModule,
    ScraperModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
