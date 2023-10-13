import { IsString } from 'class-validator';
import { RawEnv } from './raw-env.type';

export class DatabaseEnvSchema {
  @IsString()
  uri: string;

  constructor(env: RawEnv) {
    const user = env.DATABASE_USER;
    const password = env.DATABASE_PASSWORD;
    const host = env.DATABASE_HOST;
    const port = +env.DATABASE_PORT;
    const name = env.DATABASE_NAME;
    this.uri = `mongodb://${user}:${password}@${host}:${port}/${name}`;
  }
}
