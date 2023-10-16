import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerCustomOptions,
} from '@nestjs/swagger';

export const document = new DocumentBuilder()
  .setTitle('CB Digital')
  .setDescription('CB Digital API')
  .setVersion('0.0.1')
  .build();

export const options: SwaggerDocumentOptions = {
  extraModels: [],
};

export const customOptions: SwaggerCustomOptions = {
  explorer: true,
  swaggerOptions: {
    filter: true,
    tagsSorter: 'alpha',
    operationsSorter: 'alpha',
  },
};
