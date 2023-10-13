import { validateSync } from 'class-validator';
import { EnvSchema } from './env-schema';
import { RawEnv } from './types/raw-env.type';

/**
 * Validate env schema populating it with the provided env variables.
 * If the validation fails it thorws an error containing the validation error details.
 * @param env environment loaded object
 * @returns validated schema
 */
export const envValidator = (env: RawEnv) => {
  const schema = new EnvSchema(env);
  const validationErrors = validateSync(schema, {
    skipMissingProperties: false,
  });
  if (validationErrors.length > 0) {
    throw new Error(validationErrors.toString());
  }
  return schema;
};
