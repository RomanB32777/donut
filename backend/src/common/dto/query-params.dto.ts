import { ApiProperty } from '@nestjs/swagger'
import { FindOptionsOrderValue } from 'typeorm'
import { Transform } from 'class-transformer'
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import {
	IDonationsQueryData,
	PeriodItemsAll,
	allPeriodItemsTypes,
	UserRoles,
	userRoles,
	INotification,
} from 'types'
import { trueValues } from 'src/common/const'

export class QueryParamsDto<T = INotification> implements IDonationsQueryData {
	@ApiProperty({
		description: 'Allows you to display the specified number of notifications',
		type: 'number',
		example: 5,
	})
	@IsNumber()
	@Transform(({ value }) => Number(value))
	@IsOptional()
	limit: number

	@IsNumber()
	@Transform(({ value }) => Number(value))
	@IsOptional()
	offset: number

	@IsEnum(PeriodItemsAll)
	@IsOptional()
	timePeriod: allPeriodItemsTypes

	@IsEnum(UserRoles)
	@IsOptional()
	roleplay: userRoles

	@IsBoolean()
	@Transform(({ value }) => trueValues.includes(value))
	@IsOptional()
	spamFilter: boolean

	@IsString()
	@IsOptional()
	endDate: string

	@IsString()
	@IsOptional()
	startDate: string

	@IsString()
	@IsOptional()
	searchStr: string

	@IsBoolean()
	@Transform(({ value }) => trueValues.includes(value))
	@IsOptional()
	groupByName: boolean

	@IsString()
	@IsOptional()
	sortDirection?: FindOptionsOrderValue

	@IsString()
	@IsOptional()
	sort?: keyof T // sort field
}
