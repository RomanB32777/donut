import { IsEnum } from 'class-validator'
import { BlockchainsSymbols } from 'types'

export class GetExchangeDto {
	@IsEnum(BlockchainsSymbols)
	blockchain: BlockchainsSymbols
}
