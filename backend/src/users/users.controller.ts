import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Param,
	Post,
	Patch,
	UseInterceptors,
	UseGuards,
	UploadedFiles,
	UploadedFile,
	Query,
} from '@nestjs/common'
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express'
import { RealIP } from 'nestjs-real-ip'
import { lookup } from 'geoip-lite'
import { FileUploadTypes, userRoles } from 'types'

import { AuthenticationGuard } from 'src/auth/guards/auth.guard'
import { RolesGuard } from 'src/auth/guards/roles.guard'
import { UserInfo } from 'src/auth/decorators/user.decorator'
import { Roles } from 'src/auth/decorators/roles.decorator'
import { fileMimetypeFilter } from 'src/utils'
import { defaultMaxSize } from 'src/common/const'

import { User } from './entities/user.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateCreatorDto, UpdateUserDto, UserFiles } from './dto/update-user.dto'
import { UsersService } from './users.service'
import { QueryUserDto, QueryRole } from './dto/query-user.dto'

@ApiTags('Users')
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	@Roles('admin')
	@UseGuards(RolesGuard)
	@UseGuards(AuthenticationGuard)
	@ApiOperation({ summary: 'Get all users' })
	async getUsers(@Query() queryParams: QueryUserDto) {
		return await this.usersService.getUsers(queryParams)
	}

	@Get('exist/:field')
	@ApiOperation({ summary: 'Check is exist user' })
	async checkUserExist(@Param('field') field: string) {
		return await this.usersService.checkUserExist(field)
	}

	@Get('exist/:role/:field')
	@ApiOperation({ summary: 'Check is exist user' })
	async checkUserRoleExist(@Param('role') role: userRoles, @Param('field') field: string) {
		return await this.usersService.checkUserRoleExist(role, field)
	}

	@Get('id/:id')
	@ApiOperation({ summary: 'Get user by id' })
	@ApiParam({ name: 'id', required: true, description: 'User identifier' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Success',
		type: User,
	})
	async getUserById(@Param('id') id: string) {
		const { password, ...user } = await this.usersService.getUserById(id)
		return user
	}

	@Get('walletAddress/:address')
	@ApiOperation({ summary: 'Get user by address' })
	async getUserByAddress(@Param('address') address: string, @Query() query: QueryRole) {
		return await this.usersService.getUserByAddress(address, query)
	}

	@Get('username/:username')
	@ApiOperation({ summary: 'Get user by username' })
	async getUserByUsername(@Param('username') username: string) {
		return await this.usersService.getUserByUsername(username)
	}

	@Get('creator/:username')
	@ApiOperation({ summary: 'Get user+creator info by address' })
	async getCreator(@Param('username') username: string) {
		return await this.usersService.getCreator(username)
	}

	@Get('location')
	@ApiOperation({ summary: 'Get user locations by ip' })
	async getLocation(@RealIP() ip: string) {
		return lookup(ip)
	}

	@Post()
	@ApiOperation({ summary: 'Registration user (backer)' })
	async createUser(@Body() createData: CreateUserDto) {
		return this.usersService.create(createData)
	}

	@Patch()
	@UseGuards(AuthenticationGuard)
	@UseInterceptors(
		FileInterceptor(FileUploadTypes.avatar, {
			fileFilter: fileMimetypeFilter('png', 'jpeg', 'jpg', 'gif'),
			limits: {
				fileSize: defaultMaxSize,
			},
		}),
	)
	@ApiOperation({ summary: 'Update user' })
	@ApiConsumes('multipart/form-data')
	@ApiBody({ type: UpdateUserDto })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Success',
		type: User,
	})
	async updateUser(
		@UserInfo('id') userId: string,
		@Body() updateData: UpdateUserDto,
		@UploadedFile()
		file?: Express.Multer.File,
	) {
		return this.usersService.update(userId, updateData, file)
	}

	@Patch('creator')
	@Roles('creators')
	@UseGuards(RolesGuard)
	@UseGuards(AuthenticationGuard)
	@UseInterceptors(
		FileFieldsInterceptor(
			[
				{ name: FileUploadTypes.background, maxCount: 1 },
				{ name: FileUploadTypes.header, maxCount: 1 },
			],
			{
				fileFilter: fileMimetypeFilter('png', 'jpeg', 'jpg'),
				limits: {
					fileSize: defaultMaxSize,
				},
			},
		),
	)
	@ApiOperation({ summary: 'Update creator' })
	@ApiConsumes('multipart/form-data')
	@ApiBody({ type: UpdateCreatorDto })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Success',
		type: User,
	})
	async updateCreator(
		@UserInfo() user: User,
		@Body() updateData: UpdateCreatorDto,
		@UploadedFiles()
		files: UserFiles,
	) {
		return this.usersService.updateCreator(user, updateData, files)
	}

	@Delete()
	@UseGuards(AuthenticationGuard)
	@ApiOperation({ summary: 'Delete user by id' })
	async deleteUser(@UserInfo('id') id: string) {
		console.log('Delete', id)
		return this.usersService.remove(id)
	}
}
