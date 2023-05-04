import { OmitType, PartialType } from '@nestjs/swagger'
import { excludedColumsArr } from 'src/utils/base'
import { Donation } from '../entities/donation.entity'

export class CreateDonationDto extends PartialType(
	OmitType(Donation, [...excludedColumsArr, 'goal']),
) {
	goal?: string
}
