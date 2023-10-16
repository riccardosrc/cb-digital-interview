import { IsInt, IsString, IsUrl } from 'class-validator';
import { RawEnv } from './raw-env.type';

export class AppEnvSchema {
  @IsInt()
  port: number;

  @IsUrl()
  scrapingUrl: string;

  @IsString()
  openapiUrl: string;

  constructor(env: RawEnv) {
    this.port = +env.APP_PORT;
    this.scrapingUrl = env.SCRAPING_URL;
    this.openapiUrl = env.OPENAPI_URL;
  }
}
