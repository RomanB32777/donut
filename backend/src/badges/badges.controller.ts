import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Param,
	Patch,
	Post,
	Query,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { FileUploadTypes } from 'types'

import { Roles } from 'src/auth/decorators/roles.decorator'
import { UserInfo } from 'src/auth/decorators/user.decorator'
import { AuthenticationGuard } from 'src/auth/guards/auth.guard'
import { RolesGuard } from 'src/auth/guards/roles.guard'
import { MB } from 'src/common/const'
import { User } from 'src/users/entities/user.entity'
import { fileMimetypeFilter } from 'src/utils'

import { BadgesService } from './badges.service'
import { AssignBadgeDto } from './dto/assign-badge.dto'
import { CreateBadgeDto } from './dto/create-badge.dto'
import { Badge } from './entities/badge.entity'

@ApiTags('Badges')
@Controller('badges')
@UseGuards(AuthenticationGuard)
export class BadgesController {
	constructor(private readonly badgesService: BadgesService) {}

	@Post()
	@Roles('creators')
	@UseGuards(RolesGuard)
	@UseInterceptors(
		FileInterceptor(FileUploadTypes.badges, {
			fileFilter: fileMimetypeFilter('png', 'jpeg', 'jpg', 'gif'),
			limits: {
				fileSize: 5 * MB,
			},
		}),
	)
	@ApiOperation({ summary: 'Create badge' })
	@ApiConsumes('multipart/form-data')
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Success',
		type: Badge,
	})
	create(
		@Body() createBadgeDto: CreateBadgeDto,
		@UploadedFile() file: Express.Multer.File,
		@UserInfo() user: User,
	) {
		return this.badgesService.create({ ...createBadgeDto, creator: user }, file)
	}

	@Get()
	findAll(@UserInfo() user: User) {
		return this.badgesService.findAll(user)
	}

	@Get(':id')
	findOne(@Param('id') id: string, @UserInfo() user: User) {
		return this.badgesService.findOne(id, user)
	}

	@Get('price/assign')
	getAssignPrice(@Query() queryParams: AssignBadgeDto) {
		return this.badgesService.getAssignPrice(queryParams)
	}

	@Get('holders/:id')
	@Roles('creators')
	@UseGuards(RolesGuard)
	getHolders(@Param('id') id: string) {
		return this.badgesService.getBadgeHolders(id)
	}

	@Patch(':id')
	@Roles('creators')
	@UseGuards(RolesGuard)
	assignBadge(@Param('id') id: string, @Body() assignBadgeDto: AssignBadgeDto) {
		return this.badgesService.assignBadge(id, assignBadgeDto)
	}

	@Delete(':id')
	@Roles('creators')
	@UseGuards(RolesGuard)
	remove(@UserInfo('id') userId: string, @Param('id') id: string) {
		return this.badgesService.remove(userId, id)
	}
}
