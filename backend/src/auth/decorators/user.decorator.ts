import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { UserTokenPayloadDto } from '../dto/user-payload.dto'

export const UserInfo = createParamDecorator(
	async (field: keyof UserTokenPayloadDto | undefined, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest()
		return field ? request.user[field] : request.user
	},
)
