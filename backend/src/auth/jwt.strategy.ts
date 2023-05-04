import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UserStatus } from 'types'

import { AuthService } from './auth.service'
import { UserTokenPayloadDto } from './dto/user-payload.dto'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly configService: ConfigService,
		private readonly authService: AuthService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get<string>('ACCESS_TOKEN_SECRET'),
		})
	}

	async validate(payload: UserTokenPayloadDto) {
		if (payload.status === UserStatus.confirmation) {
			throw new UnauthorizedException('Confirm your account')
		}
		return { ...payload }
	}
}
