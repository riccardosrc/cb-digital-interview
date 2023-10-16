import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, SortOrder } from 'mongoose';
import { Player, PlayerDocument } from './entities/player.entity';
import { PlayerData } from './types/player-data.interface';
import {
  PaginatedResponse,
  PaginationDto,
} from '../../common/types/pagination.dto';
import { ScraperService } from '../scraper/scraper.service';
import { SortDto } from '../../common/types/sort.dto';
import { PlayerFindOptionsDto } from './dto/players-find-options.dto';

@Injectable()
export class PlayersService implements OnApplicationBootstrap {
  private logger: Logger;
  private readonly leagueToScrape = ['Serie A'];

  constructor(
    @InjectModel(Player.name) private playerModel: Model<Player>,
    private scarperService: ScraperService,
  ) {
    this.logger = new Logger(PlayersService.name);
  }

  /**
   * create all club's players
   * @param league target league
   * @param club target club
   * @param players club's players
   */
  private async createClubPlayers(
    league: string,
    club: string,
    players: PlayerData[],
  ) {
    const playersWithClub: Partial<Player>[] = players.map((player) => ({
      ...player,
      club,
      league,
    }));
    try {
      const createdPlayers = await this.playerModel.create(playersWithClub);
      this.logger.log(
        `${club} players created successfully (${createdPlayers.length})`,
      );
    } catch (error) {
      this.logger.error(`${club} players failed creation`);
      throw error;
    }
  }

  /**
   * delete all players that play fro the given club
   * @param league target league
   * @param club target club
   */
  private async deleteClubPlayers(league: string, club: string) {
    const { deletedCount } = await this.playerModel.deleteMany({
      club,
      league,
    });
    this.logger.log(`${club} players deleted successfully (${deletedCount})`);
  }

  /**
   * save all club's players
   * @param league target league
   * @param club target club
   * @param players club's players
   */
  async syncClubPlayers(league: string, club: string, players: PlayerData[]) {
    await this.deleteClubPlayers(league, club);
    await this.createClubPlayers(league, club, players);
  }

  /**
   * get player list
   * @param paginationDto pagination request
   * @returns paginated players
   */
  async findAll(
    paginationDto: PaginationDto,
    sortDto: SortDto,
    findOptionsDto: PlayerFindOptionsDto,
  ): Promise<PaginatedResponse<PlayerDocument>> {
    const { skip, limit } = paginationDto.offset;
    const sort: [string, SortOrder][] = [
      [sortDto.sortBy ?? 'name', sortDto.sortDirection ?? 'asc'],
    ];
    const filter: FilterQuery<Player> = {};
    if (findOptionsDto.name) {
      filter.name = { $regex: new RegExp(findOptionsDto.name, 'i') };
    }
    const players = await this.playerModel
      .find(filter)
      .sort(sort)
      .limit(limit)
      .skip(skip);
    const count = await this.playerModel.count();
    return new PaginatedResponse<PlayerDocument>(players, count);
  }

  /**
   * Get player details by id, with salary history if available
   * @param id player id
   * @returns player informations
   */
  async findOne(id: string): Promise<PlayerDocument> {
    const player = await this.playerModel.findById(id);
    if (!player.detailLink || player.salaryHistory.length > 0) {
      // salary history not available or already saved!
      return player;
    }
    if (player.detailLink && player.salaryHistory.length === 0) {
      player.salaryHistory =
        await this.scarperService.scrapePlayerSalaryHistory(player.detailLink);
      this.logger.log(
        `retrieved ${player.salaryHistory.length} salary entries for ${player.name}`,
      );
      const withSalary = await player.save();
      return withSalary;
    }
    return player;
  }

  async onApplicationBootstrap() {
    // sync all supported players
    await Promise.allSettled(
      this.leagueToScrape.map(async (leagueIdentifier) => {
        const playersByClub =
          await this.scarperService.scrapeLeague(leagueIdentifier);
        playersByClub.forEach(({ club, players }) =>
          this.syncClubPlayers(leagueIdentifier, club, players),
        );
      }),
    );
  }
}
