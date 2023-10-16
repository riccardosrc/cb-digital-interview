import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginatedResponseMetadataDto {
  public count: number;
}

export class PaginatedResponse<T> extends PaginatedResponseMetadataDto {
  data: T[];
  count: number;

  constructor(data: T[], count: number) {
    super();
    this.data = data;
    this.count = count;
  }
}

export interface OffsetOptions {
  skip: number;
  limit: number;
}

/**
 * Query parameters used to perform pagination
 */
export class PaginationDto {
  @IsInt()
  @Type(() => Number)
  page?: number;

  @IsInt()
  @Type(() => Number)
  perPage?: number;

  get offset(): OffsetOptions {
    const defaultPerPage = 10;
    return {
      skip: this.page ? (this.page - 1) * this.perPage : 0,
      limit: this.perPage ?? defaultPerPage,
    };
  }
}
