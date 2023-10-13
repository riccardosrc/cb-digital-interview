import { ConfigModuleOptions } from '@nestjs/config';
import { envValidator } from './env-validator';

export const configModuleOptions: ConfigModuleOptions = {
  isGlobal: true,
  envFilePath: '.env',
  validate: envValidator,
};
