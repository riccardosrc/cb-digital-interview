import { IsEnum, IsOptional } from 'class-validator';

enum SortDirection {
  asc = 'asc',
  desc = 'desc',
}

export class SortDto {
  sortBy?: string;

  @IsEnum(SortDirection)
  @IsOptional()
  sortDirection?: SortDirection;
}
