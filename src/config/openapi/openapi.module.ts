import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';
import { customOptions, document, options } from './openapi-document';

export class OpenapiModule {
  private constructor(app: INestApplication, url: string) {
    const createdDocument = SwaggerModule.createDocument(
      app,
      document,
      options,
    );
    SwaggerModule.setup(url, app, createdDocument, customOptions);
  }

  /**
   * construct the openapi document to serve at the url from the env
   * @param app Nest Application Instance
   * @param configService config provider to retrive the url of the swagger route
   */
  public static setup(app: INestApplication, configService: ConfigService) {
    const openapiUrl = configService.get<string>('app.openapiUrl');
    return new OpenapiModule(app, openapiUrl);
  }
}
