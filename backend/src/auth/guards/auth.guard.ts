import {
	BadRequestException,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import Web3Token from 'web3-token'
import { UsersService } from 'src/users/users.service'
import { UserTokenPayloadDto } from '../dto/user-payload.dto'

@Injectable()
export class AuthenticationGuard extends AuthGuard('jwt') {
	constructor(private readonly usersService: UsersService) {
		super()
	}

	getAuthorization(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest()
		return { request, authorization: request.headers?.authorization }
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		try {
			const canActivate = await super.canActivate(context)
			const { request, authorization } = this.getAuthorization(context)
			const requestUser = request?.user

			console.log('requestUserTest', requestUser)

			if (requestUser) {
				const userInfo = requestUser as UserTokenPayloadDto
				return await this.usersService.checkUserExistById(userInfo.id)
			}
			if (!canActivate || !authorization) {
				throw new UnauthorizedException('Missing auth token')
			}

			const { address } = Web3Token.verify(authorization)
			const user = await this.usersService.getUserByAddress(address, {
				roleplay: 'backers',
			})

			if (!user) {
				throw new BadRequestException('User with this wallet address not found')
			}

			request.user = user
			return true
		} catch (error) {
			throw new UnauthorizedException(error?.toString() || 'Authorization error')
		}
	}

	handleRequest(err, user, info, context: ExecutionContext) {
		if (err || !user) {
			const { authorization } = this.getAuthorization(context)
			if (!authorization) throw err || new UnauthorizedException()
		}
		return user
	}
}
