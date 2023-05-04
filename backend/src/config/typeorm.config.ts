import { ConfigModule, ConfigService, registerAs } from '@nestjs/config'
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm'

const tokenName = 'database'

export const baseTypeOrmConfig = registerAs(tokenName, () => {
	const params: TypeOrmModuleOptions = {
		type: 'postgres',
		host: process.env.TYPEORM_HOST || 'localhost',
		username: process.env.TYPEORM_USERNAME,
		password: process.env.TYPEORM_PASSWORD,
		database: process.env.TYPEORM_DATABASE,
		port: parseInt(process.env.TYPEORM_PORT, 10),
		entities: ['dist/**/*.entity.{ts,js}'],
		migrations: ['dist/**/migrations/*.js'],
		migrationsTableName: process.env.TYPEORM_MIGRATIONS_TABLE_NAME || 'migrations',
		// cli: {
		// 	migrationsDir: 'src/migrations',
		// },
		migrationsRun: process.env.TYPEORM_MIGRATIONS_RUN === 'true',
		synchronize: false,
		logging: true,
	}
	return params
})

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
	imports: [ConfigModule],
	inject: [ConfigService],
	useFactory: async (config: ConfigService): Promise<TypeOrmModuleOptions> => {
		return config.get<TypeOrmModuleOptions>(tokenName)
	},
}
