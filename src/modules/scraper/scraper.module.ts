import { Module } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { PlayersModule } from '../players/players.module';

@Module({
  imports: [PlayersModule],
  providers: [ScraperService],
  exports: [ScraperService],
})
export class ScraperModule {}
