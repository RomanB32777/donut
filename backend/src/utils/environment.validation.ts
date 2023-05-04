import { plainToClass } from 'class-transformer'
import { IsNumber, IsString, validateSync } from 'class-validator'

class EnvironmentVariables {
	@IsNumber()
	API_PORT: number

	@IsString()
	TYPEORM_HOST: string

	@IsNumber()
	TYPEORM_PORT: number

	@IsString()
	TYPEORM_USERNAME: string

	@IsString()
	TYPEORM_PASSWORD: string

	@IsString()
	TYPEORM_DATABASE: string

	@IsString()
	ACCESS_TOKEN_SECRET: string

	@IsString()
	ACCESS_TOKEN_EXPIRATION: string

	@IsString()
	MAIL_TRANSPORT: string

	@IsString()
	MAIL_FROM_NAME: string

	@IsString()
	MAIL_USER: string

	@IsString()
	MAIL_PASS: string

	@IsString()
	MAIL_HOST: string

	@IsNumber()
	MAIL_PORT: number

	@IsString()
	WALLET_KEY: string

	@IsString()
	CONTRACT_API_KEY: string

	@IsString()
	CONTRACT_ADDRESS: string

	@IsString()
	GOOGLE_APPLICATION_CREDENTIALS: string

	@IsString()
	FRONT_HOST: string
}

export const validate = (config: Record<string, unknown>) => {
	const validatedConfig = plainToClass(EnvironmentVariables, config, {
		enableImplicitConversion: true,
	})

	const errors = validateSync(validatedConfig, {
		skipMissingProperties: false,
	})

	if (errors.length) {
		throw new Error(errors.toString())
	}
	return validatedConfig
}
