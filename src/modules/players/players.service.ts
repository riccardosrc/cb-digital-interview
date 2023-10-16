import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player } from './entities/player.entity';
import { PlayerData } from './types/player-data.interface';

@Injectable()
export class PlayersService {
  private logger: Logger;
  constructor(@InjectModel(Player.name) private playerModel: Model<Player>) {
    this.logger = new Logger(PlayersService.name);
  }

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

  private async deleteClubPlayers(club: string) {
    const { deletedCount } = await this.playerModel.deleteMany({ club });
    this.logger.log(`${club} players deleted successfully (${deletedCount})`);
  }

  async syncClubPlayers(club: string, players: PlayerData[]) {
    await this.deleteClubPlayers(club);
    await this.createClubPlayers(club, players);
  }

  findAll() {
    return `This action returns all players`;
  }

  findOne(id: number) {
    return `This action returns a #${id} player`;
  }
}
