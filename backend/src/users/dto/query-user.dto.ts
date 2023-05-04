import { ApiProperty, PickType } from '@nestjs/swagger'
import { IsString, IsEnum, IsEmail, IsOptional } from 'class-validator'
import { UserRoles, userRoles, userStatus } from 'types'

import { User } from 'src/users/entities/user.entity'
import { userValidationMessages } from 'src/common/const'

export class QueryUserDto extends PickType(User, [
	'id',
	'walletAddress',
	'username',
	'email',
	'status',
	'roleplay',
]) {
	@IsString()
	@IsOptional()
	@ApiProperty({ required: false })
	id: string

	@IsString()
	@IsOptional()
	@ApiProperty({ required: false })
	walletAddress: string

	@IsString()
	@IsOptional()
	@ApiProperty({ required: false })
	username: string

	@IsEmail(
		{},
		{
			message: ({ property }) => `${property}: ${userValidationMessages?.email?.notValid}`,
		},
	)
	@IsOptional()
	@ApiProperty({ required: false })
	email: string

	@IsEnum(UserRoles)
	@IsOptional()
	@ApiProperty({ required: false })
	status: userStatus

	@IsEnum(UserRoles)
	@IsOptional()
	@ApiProperty({ required: false })
	roleplay: userRoles
}

export type QueryRole = Partial<Pick<QueryUserDto, 'roleplay'>>
