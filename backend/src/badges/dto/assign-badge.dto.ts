import { Transform } from 'class-transformer'
import { IsNumber, IsOptional, IsString } from 'class-validator'
import { IBagdeAssignInfo } from 'types'

export class AssignBadgeDto implements IBagdeAssignInfo {
	@IsString()
	userAddress: string

	@IsNumber()
	@Transform(({ value }) => Number(value))
	@IsOptional()
	tokenId?: number
}
