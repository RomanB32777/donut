import { OmitType, PartialType } from '@nestjs/swagger'
import { IsString, IsEnum, MinLength, MaxLength, IsNotEmpty, IsEmail } from 'class-validator'
import { UserRoles, userRoles } from 'types'

import { User } from 'src/users/entities/user.entity'
import { excludedColumsArr } from 'src/utils/base'
import { userValidationMessages } from 'src/common/const'

export class CreateUserDto extends PartialType(OmitType(User, excludedColumsArr)) {
	@IsString()
	@IsNotEmpty()
	username: string

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

	@IsEnum(UserRoles)
	@IsNotEmpty()
	roleplay: userRoles
}
