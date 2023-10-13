import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';

export const mongooseOptions: MongooseModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    uri: configService.get('database.uri'),
    dbName: configService.get('database.name'),
    auth: {
      username: configService.get('database.user'),
      password: configService.get('database.password'),
    },
  }),
};
