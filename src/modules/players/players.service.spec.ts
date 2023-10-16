import { Test, TestingModule } from '@nestjs/testing';
import { PlayersService } from './players.service';
import { ScraperService } from '../scraper/scraper.service';
import { Player, PlayerDocument } from './entities/player.entity';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { createMock } from '@golevelup/ts-jest';
import { PaginationDto } from '../../common/types/pagination.dto';
import { SortDirection } from '../../common/types/sort.dto';
import { PlayerData } from './types/player-data.interface';

const commonPlayerStub: PlayerData = {
  age: 20,
  name: 'Random Player',
  nationality: 'Italy',
  position: 'ST',
  weeklySalary: 1000,
  yearlySalary: 48000,
  detailLink: '/fake-link',
};

describe('PlayersService', () => {
  let service: PlayersService;
  let scarperService: ScraperService;
  let model: Model<Player>;
  let stubPlayer: Partial<PlayerDocument>;

  beforeEach(async () => {
    const modelToken = getModelToken(Player.name);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayersService,
        { provide: modelToken, useFactory: createMock },
        {
          provide: ScraperService,
          useValue: createMock<ScraperService>(),
        },
      ],
    }).compile();

    service = module.get<PlayersService>(PlayersService);
    scarperService = module.get<ScraperService>(ScraperService);
    model = module.get<Model<Player>>(modelToken);

    stubPlayer = {
      ...commonPlayerStub,
      id: 'abc123',
      club: 'Club',
      league: 'League',
      salaryHistory: [],
      save: jest.fn().mockReturnThis(),
    };
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated list of players', async () => {
      model.find = jest.fn().mockReturnValueOnce({
        sort: () => ({
          limit: () => ({
            skip: jest.fn().mockResolvedValueOnce([{ ...stubPlayer }]),
          }),
        }),
      });
      model.count = jest.fn().mockResolvedValueOnce(1);
      const pagination = new PaginationDto();
      pagination.page = 1;
      pagination.perPage = 10;

      const res = await service.findAll(
        pagination,
        { sortBy: 'name', sortDirection: SortDirection.asc },
        { name: 'Random' },
      );

      expect(res.data).toBeInstanceOf(Array);
      expect(res.data[0].name).toBe('Random Player');
      expect(res.count).toBe(1);
      expect(model.find).toBeCalled();
      expect(model.count).toBeCalled();
    });
  });

  describe('findOne', () => {
    it('should return the player for the given id', async () => {
      model.findById = jest.fn().mockResolvedValueOnce({ ...stubPlayer });
      scarperService.scrapePlayerSalaryHistory = jest
        .fn()
        .mockResolvedValueOnce([
          {
            year: 2023,
            weeklySalary: 1000,
            yearlySalary: 48000,
            club: 'Club',
            position: 'ST',
            league: 'League',
            age: 20,
            contractExpiry: '31-12-2026',
          },
        ]);

      const res = await service.findOne('abc123');

      expect(res.id).toBe('abc123');
      expect(res.salaryHistory[0].contractExpiry).toBe('31-12-2026');
      expect(model.findById).toBeCalledWith('abc123');
      expect(scarperService.scrapePlayerSalaryHistory).toBeCalledWith(
        '/fake-link',
      );
    });
  });

  describe('syncClubPlayers', () => {
    it('should delete all players of the given club and re-create them', async () => {
      const playersData = [{ ...commonPlayerStub }];
      model.deleteMany = jest.fn().mockResolvedValueOnce({ deleteCount: 10 });
      model.create = jest.fn().mockResolvedValueOnce(playersData);

      await service.syncClubPlayers('League', 'Club', playersData);

      expect(model.deleteMany).toBeCalledWith({
        club: 'Club',
        league: 'League',
      });
      expect(model.create).toBeCalled();
    });
  });
});
