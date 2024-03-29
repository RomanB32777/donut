import {
	BadRequestException,
	HttpException,
	HttpStatus,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOptionsWhere, ILike, Repository } from 'typeorm'
import { donatAssetTypes, userRoles } from 'types'

import { AlertWidget } from 'src/widgets/alerts/entities/alert-widget.entity'
import { AlertsService } from 'src/widgets/alerts/alerts.service'
import { FilesService } from 'src/files/files.service'
import { roles, userValidationMessages } from 'src/common/const'

import { User } from './entities/user.entity'
import { Creator } from './entities/creator.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateCreatorDto, UpdateUserDto, UserFiles } from './dto/update-user.dto'
import { getDefaultValues } from 'src/utils'
import { QueryUserDto, QueryRole } from './dto/query-user.dto'
import { getTimePeriod } from 'src/utils/dates'

@Injectable()
export class UsersService {
	constructor(
		private readonly fileService: FilesService,
		private readonly alertsService: AlertsService,

		@InjectRepository(User)
		private usersRepository: Repository<User>,

		@InjectRepository(Creator)
		private creatorsRepository: Repository<Creator>,
	) {}

	async create(createdUser: CreateUserDto) {
		const { roleplay, walletAddress, username } = createdUser
		if (walletAddress) {
			const isExist = await this.checkUserExist(walletAddress)
			if (isExist) {
				throw new BadRequestException('User with this address already exists')
			}
		}
		if (username[0] !== '@') createdUser.username = `@${username}`
		const newUser = this.usersRepository.create({ ...createdUser })

		if (roles.filter((role) => role !== 'backers').includes(roleplay)) {
			newUser.creator = new Creator()
			newUser.alert = new AlertWidget()
		} else {
			newUser.status = 'active'
		}

		const newSavedUser = await this.usersRepository.save(newUser)

		// this is creator
		if (newSavedUser.alert) {
			const { id: alertId } = newSavedUser.alert
			await this.alertsService.setDefaultSound(alertId)
		}
		return newSavedUser
	}

	async checkUserExist(field: string) {
		const user = await this.usersRepository.findOne({
			select: { roleplay: true },
			where: [{ walletAddress: field }, { username: field }, { email: field }],
		})
		if (!user) return false
		return user
	}

	async checkUserExistById(id: string) {
		return await this.usersRepository.exist({ where: { id } })
	}

	async checkUserRoleExist(roleplay: userRoles, field: string) {
		return await this.usersRepository.exist({
			where: [
				{ walletAddress: field, roleplay },
				{ username: field, roleplay },
				{ email: field, roleplay },
			],
		})
	}

	async getUsers(queryParams?: QueryUserDto) {
		const { timePeriod, startDate, endDate, ...params } = queryParams
		const where: FindOptionsWhere<User> = { ...params }
		if ((startDate && endDate) || (timePeriod && timePeriod !== 'all')) {
			where.createdAt = getTimePeriod({
				timePeriod,
				startDate,
				endDate,
			})
		}
		const [users, count] = await this.usersRepository.findAndCount({
			where,
			order: { createdAt: 'DESC' },
			relations: {
				creatorDonations: true,
				backerDonations: true,
				notifications: true,
				creator: true,
				alert: true,
				goals: true,
				stats: true,
			},
		})
		return { count, users }
	}

	async getUserById(id: string) {
		return await this.usersRepository.findOneOrFail({
			where: { id },
			relations: { creator: true },
		})
	}

	async getUserByAddress(walletAddress: string, query?: QueryRole) {
		return await this.usersRepository.findOne({
			where: {
				walletAddress: ILike(`%${walletAddress}%`),
				roleplay: query?.roleplay,
			},
		})
	}

	async getUserByEmail(email: string) {
		try {
			return await this.usersRepository.findOneOrFail({
				where: { email },
				relations: {
					creator: true,
					alert: true,
				},
			})
		} catch (error) {
			throw new NotFoundException(`email: ${userValidationMessages?.email?.notFound}`)
		}
	}

	async getCreator(username: string) {
		const creator = await this.usersRepository.findOne({
			relations: { creator: true },
			select: {
				id: true,
				avatarLink: true,
				username: true,
				walletAddress: true,
				status: true,
				creator: {
					headerBanner: true,
					backgroundBanner: true,
					welcomeText: true,
					btnText: true,
					mainColor: true,
					backgroundColor: true,
					spamFilter: true,
				},
			},
			where: { roleplay: 'creators', username },
		})
		if (!creator) {
			throw new HttpException('Creator not found', HttpStatus.NO_CONTENT)
		}
		return creator
	}

	async getUserByUsername(username: string): Promise<User> {
		return await this.usersRepository.findOneBy({ username })
	}

	async remove(id: string) {
		await this.usersRepository.delete({ id }) // softDelete - TODO
		return { id }
	}

	async removeByEmail(email: string) {
		await this.usersRepository.delete({ email }) // softDelete - TODO
		return { email }
	}

	async update(
		userId: string,
		updatedUser: UpdateUserDto,
		file?: Express.Multer.File,
	): Promise<User> {
		const { username } = updatedUser

		if (updatedUser.walletAddress) {
			const isExist = await this.checkUserExist(updatedUser.walletAddress)
			if (isExist) {
				throw new BadRequestException('User with this address already exists')
			}
		}

		if (username && username?.[0] !== '@') {
			updatedUser.username = `@${username}`
		}

		if (file) {
			const { path } = this.fileService.uploadFile(file, userId, 'avatar')
			updatedUser.avatarLink = path
		}
		await this.usersRepository.update({ id: userId }, { ...updatedUser })
		return await this.getUserById(userId)
	}

	async updateCreator(
		userId: string,
		updatedCreator: UpdateCreatorDto,
		uploadFiles?: UserFiles,
	): Promise<User> {
		const { isReset, ...creatorData } = updatedCreator

		if (isReset) {
			const columns = getDefaultValues(this.creatorsRepository, ['spamFilter'])
			await this.creatorsRepository.update({ user: { id: userId } }, { ...columns })
		} else {
			if (uploadFiles) {
				Object.entries(uploadFiles).forEach(([key, files]) => {
					if (files) {
						const folderType = key as donatAssetTypes
						const [file] = files
						const { path } = this.fileService.uploadFile(file, userId, folderType)
						const updatedField = `${folderType}Banner`
						creatorData[updatedField] = path
					}
				})
			}

			if (Object.keys(creatorData).length) {
				await this.creatorsRepository.update({ user: { id: userId } }, { ...creatorData })
			}
		}
		return await this.getUserById(userId)
	}

	// async setDefaultTwitchBanner(id: string) {
	// 	const [image] = this.fileService.getAssetsFiles('twitch')
	// 	if (image) {
	// 		await this.updateCreator(id, {
	// 			twitchBanner: image.path,
	// 		})
	// 	}
	// }
}
