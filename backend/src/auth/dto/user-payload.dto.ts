import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'
import { PickType } from '@nestjs/swagger'
import { IUserTokenPayload } from 'types'
import { User } from 'src/users/entities/user.entity'
import { userValidationMessages } from 'src/common/const'

export class UserTokenPayloadDto
	extends PickType(User, ['id', 'email', 'status', 'username', 'roleplay'])
	implements IUserTokenPayload {}

export class UserLoginDto extends PickType(User, ['email', 'password']) {
	@IsEmail(
		{},
		{
			message: ({ property }) => `${property}: ${userValidationMessages?.email?.notValid}`,
		},
	)
	@IsNotEmpty()
	email: string

	@IsString()
	@MinLength(5, {
		message: ({ property }) => `${property}: ${userValidationMessages?.password?.min}`,
	})
	@MaxLength(15, {
		message: ({ property }) => `${property}: ${userValidationMessages?.password?.max}`,
	})
	@IsNotEmpty()
	password: string
}
