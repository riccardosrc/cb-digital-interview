import { IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { EnvTarget } from './types/env-target.enum';
import { AppEnvSchema } from './types/app-env-schema';
import { RawEnv } from './types/raw-env.type';
import { DatabaseEnvSchema } from './types/database-env-schema';

/**
 * Environment class, used to perform validation against provided environment variables
 */
export class EnvSchema {
  @IsEnum(EnvTarget)
  target: EnvTarget;

  @ValidateNested()
  @Type(() => AppEnvSchema)
  app: AppEnvSchema;

  @ValidateNested()
  @Type(() => DatabaseEnvSchema)
  database: DatabaseEnvSchema;

  constructor(env: RawEnv) {
    this.target = EnvTarget[env.ENV_TARGET];
    this.app = new AppEnvSchema(env);
    this.database = new DatabaseEnvSchema(env);
  }
}
