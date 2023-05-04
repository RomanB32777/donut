import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { AuthenticationGuard } from 'src/auth/guards/auth.guard'
import { RolesGuard } from 'src/auth/guards/roles.guard'
import { Roles } from 'src/auth/decorators/roles.decorator'
import { QueryParamsDto } from 'src/common/dto/query-params.dto'
import { WidgetsService } from './widgets.service'

@ApiTags('Donations widgets')
@Controller('donations/widgets')
export class WidgetsController {
	constructor(private readonly widgetsService: WidgetsService) {}

	@Get('top-donations/:userId')
	getTopDonations(@Param('userId') userId: string, @Query() queryParams: QueryParamsDto) {
		return this.widgetsService.getTopDonations(userId, queryParams)
	}

	@Get('latest-donations/:userId')
	getLatestDonations(@Param('userId') userId: string, @Query() queryParams: QueryParamsDto) {
		return this.widgetsService.getLatestDonations(userId, queryParams)
	}

	@Get('top-supporters/:userId')
	getTopSupporters(@Param('userId') userId: string, @Query() queryParams: QueryParamsDto) {
		return this.widgetsService.getTopSupporters(userId, queryParams)
	}

	@Get('stats/:userId')
	@Roles('creators')
	@UseGuards(RolesGuard)
	@UseGuards(AuthenticationGuard)
	getStatsDonations(@Param('userId') userId: string, @Query() queryParams: QueryParamsDto) {
		return this.widgetsService.getStatsDonations(userId, queryParams)
	}
}
