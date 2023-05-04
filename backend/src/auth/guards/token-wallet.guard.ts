import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { UsersService } from 'src/users/users.service'
import Web3Token from 'web3-token'

@Injectable()
export class WalletTokenGuard implements CanActivate {
	constructor(private readonly usersService: UsersService) {}

	async canActivate(context: ExecutionContext) {
		try {
			const request = context.switchToHttp().getRequest()
			const token = request.headers?.authorization

			if (!token) throw new UnauthorizedException('Missing auth token')

			const { address } = Web3Token.verify(token)
			const { body, params } = request

			const reqAddress =
				body.address || body.walletAddress || params.address || params.walletAddress

			if (reqAddress && reqAddress.toLowerCase() !== address.toLowerCase())
				throw new UnauthorizedException('Auth token invalid')

			const user = await this.usersService.getUserByAddress(address)
			request.user = user
			return true
		} catch (error) {
			throw new UnauthorizedException('Auth token invalid')
		}
	}
}
