import { PartialType, OmitType, ApiProperty } from '@nestjs/swagger'
import { Exclude, Transform } from 'class-transformer'
import { IsBoolean, IsOptional } from 'class-validator'
import { trueValues } from 'src/common/const'
import { FileUploadTypes, IResetField } from 'types'

import { User } from '../entities/user.entity'
import { Creator } from './../entities/creator.entity'
import { CreateUserDto } from './create-user.dto'

export type UserFiles = {
	[FileUploadTypes.background]?: Express.Multer.File[]
	[FileUploadTypes.header]?: Express.Multer.File[]
	[FileUploadTypes.avatar]?: Express.Multer.File[]
}

export class UpdateUserDto extends PartialType(
	OmitType(CreateUserDto, ['roleplay', 'walletAddress', 'creator']),
) {
	walletAddress?: string;

	@ApiProperty({
		description: 'User avatar file',
		type: 'file',
		format: 'binary',
		required: false,
	})
	@IsOptional()
	[FileUploadTypes.avatar]?: Express.Multer.File
}

export class UpdateCreatorDto
	extends PartialType(OmitType(Creator, ['id', 'user']))
	implements IResetField
{
	@Exclude()
	user: User

	@IsOptional()
	@IsBoolean()
	@Transform(({ value }) => trueValues.includes(value))
	isReset?: boolean;

	@ApiProperty({
		description: 'Donation page header image file',
		type: 'file',
		format: 'binary',
		required: false,
	})
	@IsOptional()
	[FileUploadTypes.header]?: Express.Multer.File;

	@ApiProperty({
		description: 'Donation page background image file',
		type: 'file',
		format: 'binary',
		required: false,
	})
	@IsOptional()
	[FileUploadTypes.background]?: Express.Multer.File
}
