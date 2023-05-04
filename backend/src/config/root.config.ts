import { ConfigModule } from '@nestjs/config'
import { baseTypeOrmConfig } from './typeorm.config'
import { validate } from 'src/utils/environment.validation'

export const SetConfigRoot = () =>
	ConfigModule.forRoot({
		isGlobal: true,
		load: [baseTypeOrmConfig],
		envFilePath: '../.env',
		validate,
	})
