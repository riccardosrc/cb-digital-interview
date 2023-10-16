import { Controller, Get, Param, Query } from '@nestjs/common';
import { PlayersService } from './players.service';
import { ApiOkResponsePaginated } from 'src/common/decorators/api-ok-response-paginated';
import { Player } from './entities/player.entity';
import { PaginationDto } from 'src/common/types/pagination.dto';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  @ApiOkResponsePaginated(Player)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.playersService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playersService.findOne(id);
  }
}
