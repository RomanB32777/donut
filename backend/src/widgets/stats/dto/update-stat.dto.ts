import { PartialType } from '@nestjs/swagger'
import { Exclude } from 'class-transformer'
import { IsBoolean, IsOptional } from 'class-validator'
import { PeriodItemsAll, StatsDataTypes } from 'types'

import { User } from 'src/users/entities/user.entity'
import { CreateStatDto } from './create-stat.dto'

export class UpdateStatDto extends PartialType(CreateStatDto) {
	@IsBoolean()
	@IsOptional()
	isReset?: boolean

	@Exclude()
	creator: User

	@IsOptional()
	title: string

	@IsOptional()
	description: string

	@IsOptional()
	template: string

	@IsOptional()
	dataType: StatsDataTypes

	@IsOptional()
	timePeriod: PeriodItemsAll
}
