import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ScheduleModule } from '@nestjs/schedule'

import { UsersModule } from 'src/users/users.module'
import { MailModule } from 'src/mail/mail.module'
import { UsersService } from 'src/users/users.service'

import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtStrategy } from './jwt.strategy'
import { AuthToken } from './entities/token.entity'

@Module({
	imports: [
		ConfigModule,
		UsersModule,
		MailModule,
		JwtModule.registerAsync({
			imports: [ConfigModule, UsersModule],
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get<string>('ACCESS_TOKEN_SECRET'),
				signOptions: {
					expiresIn: configService.get<string>('ACCESS_TOKEN_EXPIRATION'),
				},
			}),
			inject: [ConfigService, UsersService],
		}),
		TypeOrmModule.forFeature([AuthToken]),
		ScheduleModule.forRoot(),
	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
