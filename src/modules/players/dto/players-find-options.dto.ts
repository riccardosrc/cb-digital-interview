import { IsOptional, IsString } from 'class-validator';

export class PlayerFindOptionsDto {
  @IsString()
  @IsOptional()
  name?: string;
}
