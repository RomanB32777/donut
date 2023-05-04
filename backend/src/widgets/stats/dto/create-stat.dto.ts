import { OmitType, PartialType } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import { excludedColumsArr } from 'src/utils/base'
import { StatWidget } from '../entities/stat-widget.entity'

export class CreateStatDto extends PartialType(OmitType(StatWidget, excludedColumsArr)) {
	@IsOptional()
	customTimePeriod?: string
}
