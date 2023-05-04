import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const AuthJwtToken = createParamDecorator(async (data: unknown, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest()
	const authorization = request.headers.authorization
	if (authorization) return authorization.split('Bearer ')[1]
	return ''
})
