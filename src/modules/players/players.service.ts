import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player } from './entities/player.entity';
import { PlayerData } from './types/player-data.interface';
import {
  PaginatedResponse,
  PaginationDto,
} from 'src/common/types/pagination.dto';

@Injectable()
export class PlayersService {
  private logger: Logger;
  constructor(@InjectModel(Player.name) private playerModel: Model<Player>) {
    this.logger = new Logger(PlayersService.name);
  }

  /**
   * create all club's players
   * @param club target club
   * @param players club's players
   */
  private async createClubPlayers(club: string, players: PlayerData[]) {
    const playersWithClub: Partial<Player>[] = players.map((player) => ({
      ...player,
      club,
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
   * @param club target club
   */
  private async deleteClubPlayers(club: string) {
    const { deletedCount } = await this.playerModel.deleteMany({ club });
    this.logger.log(`${club} players deleted successfully (${deletedCount})`);
  }

  /**
   * save all club's players
   * @param club target club
   * @param players club's players
   */
  async syncClubPlayers(club: string, players: PlayerData[]) {
    await this.deleteClubPlayers(club);
    await this.createClubPlayers(club, players);
  }

  /**
   * get player list
   * @param paginationDto pagination request
   * @returns paginated players
   */
  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<Player>> {
    const { skip, limit } = paginationDto.offset;
    const players = await this.playerModel.find().limit(limit).skip(skip);
    const count = await this.playerModel.count();
    return new PaginatedResponse<Player>(players, count);
  }

  /**
   * Get player details by id, with salary history if available
   * @param id player id
   * @returns player informations
   */
  async findOne(id: string): Promise<Player> {
    const player = await this.playerModel.findById(id);
    return player;
  }
}
