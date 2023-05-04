import { ApiProperty, PartialType } from '@nestjs/swagger'
import { User } from 'src/users/entities/user.entity'
import { Badge } from '../entities/badge.entity'

export class CreateBadgeDto extends PartialType(Badge) {
	@ApiProperty({
		description: 'Badge image file',
		type: 'file',
		format: 'binary',
	})
	file!: Express.Multer.File

	creator!: User
	description!: string
}
