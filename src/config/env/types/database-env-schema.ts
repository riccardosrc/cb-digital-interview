import { IsString } from 'class-validator';
import { RawEnv } from './raw-env.type';

export class DatabaseEnvSchema {
  @IsString()
  uri: string;

  @IsString()
  user: string;

  @IsString()
  password: string;

  @IsString()
  name: string;

  constructor(env: RawEnv) {
    this.user = env.DATABASE_USER;
    this.password = env.DATABASE_PASSWORD;
    this.name = env.DATABASE_NAME;
    const host = env.DATABASE_HOST;
    const port = +env.DATABASE_PORT;
    this.uri = `mongodb://${host}:${port}`;
  }
}
