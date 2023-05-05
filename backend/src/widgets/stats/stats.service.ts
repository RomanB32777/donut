import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { User } from 'src/users/entities/user.entity'
import { CreateStatDto } from './dto/create-stat.dto'
import { UpdateStatDto } from './dto/update-stat.dto'
import { StatWidget } from './entities/stat-widget.entity'
import { getDefaultValues } from 'src/utils'
import { PeriodItemsAll } from 'types'

@Injectable()
export class StatsService {
	constructor(
		@InjectRepository(StatWidget)
		private statsRepository: Repository<StatWidget>,
	) {}

	async create(user: User, createStatDto: CreateStatDto) {
		return await this.statsRepository.save({ ...createStatDto, creator: user })
	}

	async findAll(userId: string) {
		return await this.statsRepository.find({
			where: { creator: { id: userId } },
			order: { createdAt: 'DESC' },
		})
	}

	async findOne(id: string) {
		return await this.statsRepository.findOneByOrFail({ id })
	}

	async update(userId: string, id: string, updateStatDto: UpdateStatDto) {
		const { isReset, customTimePeriod, ...updateData } = updateStatDto

		if (isReset) {
			const columns = getDefaultValues(this.statsRepository, ['title'])
			await this.statsRepository.update({ id, creator: { id: userId } }, { ...columns })
		} else {
			await this.statsRepository.update(
				{ id, creator: { id: userId } },
				{
					...updateData,
					customTimePeriod:
						updateData.timePeriod === PeriodItemsAll.custom ? customTimePeriod : null,
				},
			)
		}

		return await this.findOne(id)
	}

	async remove(userId: string, id: string) {
		const { affected } = await this.statsRepository.softDelete({
			id,
			creator: { id: userId },
		})
		if (!affected) {
			throw new NotFoundException('Widget with this id was not found')
		}
		return { id }
	}
}
