import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  validateSync,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Provision = 'provision',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment = Environment.Development;

  @IsNumber()
  @Min(0)
  @Max(65535)
  PORT: number = 3000;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string;

  @IsString()
  JWT_EXPIRATION_TIME: string = '1h';

  @IsString()
  @IsNotEmpty()
  JWT_REFRESH_SECRET: string;

  @IsString()
  JWT_REFRESH_EXPIRATION: string = '7d';

  @IsString()
  JWT_RESET_SECRET: string;

  @IsString()
  JWT_RESET_EXPIRATION: string = '30m';

  @IsString()
  @IsNotEmpty()
  MONGO_URI: string;

  @IsString()
  @IsNotEmpty()
  MAILER_HOST: string;

  @IsNumber()
  MAILER_PORT: number = 587;

  @IsString()
  @IsNotEmpty()
  MAILER_USER: string;

  @IsString()
  @IsOptional()
  MAILER_PASS?: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
