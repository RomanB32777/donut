import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { AuthenticationGuard } from 'src/auth/guards/auth.guard'
import { UserInfo } from 'src/auth/decorators/user.decorator'
import { User } from 'src/users/entities/user.entity'
import { Roles } from 'src/auth/decorators/roles.decorator'
import { RolesGuard } from 'src/auth/guards/roles.guard'

import { StatsService } from './stats.service'
import { CreateStatDto } from './dto/create-stat.dto'
import { UpdateStatDto } from './dto/update-stat.dto'

@ApiTags('In-stream statistics')
@Controller('widgets/stats')
export class StatsController {
	constructor(private readonly statsService: StatsService) {}

	@Post()
	@Roles('creators')
	@UseGuards(RolesGuard)
	@UseGuards(AuthenticationGuard)
	create(@UserInfo() user: User, @Body() createStatDto: CreateStatDto) {
		return this.statsService.create(user, createStatDto)
	}

	@Get()
	@Roles('creators')
	@UseGuards(RolesGuard)
	@UseGuards(AuthenticationGuard)
	findAll(@UserInfo('id') userId: string) {
		return this.statsService.findAll(userId)
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.statsService.findOne(id)
	}

	@Patch(':id')
	@Roles('creators')
	@UseGuards(RolesGuard)
	@UseGuards(AuthenticationGuard)
	update(
		@UserInfo('id') userId: string,
		@Param('id') id: string,
		@Body() updateStatDto: UpdateStatDto,
	) {
		return this.statsService.update(userId, id, updateStatDto)
	}

	@Delete(':id')
	@Roles('creators')
	@UseGuards(RolesGuard)
	@UseGuards(AuthenticationGuard)
	remove(@UserInfo('id') userId: string, @Param('id') id: string) {
		return this.statsService.remove(userId, id)
	}
}
