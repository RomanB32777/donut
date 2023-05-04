import { Controller, Get, Post, Body, HttpStatus, UseGuards, Query } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { AuthenticationGuard } from 'src/auth/guards/auth.guard'
import { UserInfo } from 'src/auth/decorators/user.decorator'
import { RolesGuard } from 'src/auth/guards/roles.guard'
import { Roles } from 'src/auth/decorators/roles.decorator'
import { QueryParamsDto } from 'src/common/dto/query-params.dto'
import { User } from 'src/users/entities/user.entity'

import { DonationsService } from './donations.service'
import { CreateDonationDto } from './dto/create-donation.dto'
import { Donation } from './entities/donation.entity'

@ApiTags('Donations')
@Controller('donations')
@UseGuards(AuthenticationGuard)
export class DonationsController {
	constructor(private readonly donationsService: DonationsService) {}

	@Post()
	@ApiOperation({ summary: 'Create a record of the perfect donation' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Success',
		type: Donation,
	})
	create(@Body() createDonationDto: CreateDonationDto) {
		return this.donationsService.create(createDonationDto)
	}

	@Get()
	findAll(@UserInfo('id') userId: string) {
		return this.donationsService.findAll(userId)
	}

	@Get('supporters')
	@Roles('creators')
	@UseGuards(RolesGuard)
	getSupporters(@UserInfo('id') creatorId: string) {
		return this.donationsService.getSupporters(creatorId)
	}

	@Get('page')
	getPageDonations(@UserInfo() user: User, @Query() queryParams: QueryParamsDto) {
		return this.donationsService.getPageDonations(user, queryParams)
	}
}
