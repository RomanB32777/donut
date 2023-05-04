import { Controller, Get, Param, UseGuards } from '@nestjs/common'

import { Roles } from 'src/auth/decorators/roles.decorator'
import { UserInfo } from 'src/auth/decorators/user.decorator'
import { AuthenticationGuard } from 'src/auth/guards/auth.guard'
import { RolesGuard } from 'src/auth/guards/roles.guard'
import { FilesService } from './files.service'
import { DefaultTypeParam } from './entities/file.entity'

@Controller('files')
@Roles('creators', 'admin')
@UseGuards(RolesGuard)
@UseGuards(AuthenticationGuard)
export class FilesController {
	constructor(private readonly filesService: FilesService) {}

	@Get('default-images/:type')
	getDefaultImages(@Param() { type }: DefaultTypeParam) {
		return this.filesService.getAssetsFiles(type)
	}

	@Get('sounds')
	getSounds(@UserInfo('id') userId: string) {
		const uploadSounds = this.filesService.getUploadsFiles('sound', userId)
		const assetsSounds = this.filesService.getAssetsFiles('sound')
		return [...uploadSounds, ...assetsSounds]
	}
}
