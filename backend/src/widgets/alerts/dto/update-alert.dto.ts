import { ApiProperty, PartialType } from '@nestjs/swagger'
import { Exclude, Transform } from 'class-transformer'
import { IsBoolean, IsOptional } from 'class-validator'
import { IResetField, FileUploadTypes } from 'types'

import { User } from 'src/users/entities/user.entity'
import { CreateAlertDto } from './create-alert.dto'
import { trueValues } from 'src/common/const'

export class UpdateAlertDto extends PartialType(CreateAlertDto) implements IResetField {
	@Exclude()
	creator: User;

	@ApiProperty({
		description: 'Alert widget image file',
		type: 'file',
		format: 'binary',
		required: false,
	})
	@IsOptional()
	[FileUploadTypes.alert]?: Express.Multer.File

	@IsOptional()
	@IsBoolean()
	@Transform(({ value }) => trueValues.includes(value))
	isReset?: boolean
}
