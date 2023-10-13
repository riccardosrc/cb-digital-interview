import { IsInt } from 'class-validator';
import { RawEnv } from './raw-env.type';

export class AppEnvSchema {
  @IsInt()
  port: number;

  constructor(env: RawEnv) {
    this.port = +env.APP_PORT;
  }
}
