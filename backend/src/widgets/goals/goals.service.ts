import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { getDefaultValues } from 'src/utils';
import { User } from 'src/users/entities/user.entity';
import { ExchangeService } from 'src/donations/exchange/exchange.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import {
  GoalWidget,
  GoalWidgetWithAmountRaised,
} from './entities/goal-widget.entity';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(GoalWidget)
    private goalsRepository: Repository<GoalWidget>,

    private readonly exchangeService: ExchangeService,
  ) {}

  private async getSelectQuery(user: Partial<User>, widgetId?: string) {
    const { id: userId, username } = user;
    const sumSelect = await this.exchangeService.sumQuerySelect();

    const fields: (keyof GoalWidget)[] = [
      'id',
      'isArchive',
      'title',
      'amountGoal',
      'titleColor',
      'titleFont',
      'progressColor',
      'progressFont',
      'backgroundColor',
    ];

    const query = this.goalsRepository
      .createQueryBuilder('goal')
      .select('sums.sum', 'amountRaised')
      .leftJoin(
        (subQ) =>
          subQ
            .select(sumSelect, 'sum')
            .addSelect('subQ.id', 'id')
            .from(GoalWidget, 'subQ')
            .leftJoin('subQ.donations', 'd')
            .groupBy('subQ.id'),
        'sums',
        'sums.id = goal.id',
      )
      .leftJoin('goal.creator', 'creator')
      .orderBy('goal.createdAt', 'DESC');

    if (userId) query.where('goal.creator = :userId', { userId });
    else if (username) {
      query.where('creator.username = :username', { username });
    }

    fields.forEach((field) => query.addSelect(`goal.${field}`, field));

    if (widgetId) query.andWhere('goal.id = :widgetId', { widgetId });
    return query;
  }

  async create(creator: User, createGoalDto: CreateGoalDto) {
    return await this.goalsRepository.save({
      ...createGoalDto,
      creator,
    });
  }

  async findAll(userId: string) {
    const goalsQuery = await this.getSelectQuery({ id: userId });
    return await goalsQuery.getRawMany();
  }

  async findOne(id: string, username?: string) {
    if (!username) return await this.goalsRepository.findOneByOrFail({ id });

    const goalQuery = await this.getSelectQuery({ username }, id);
    return await goalQuery.getRawOne();
  }

  async checkGoalRelevance(userId: string, id: string) {
    const goalsQuery = await this.getSelectQuery({ id: userId }, id);
    const goalSums = await goalsQuery.getRawOne<GoalWidgetWithAmountRaised>();

    if (goalSums) {
      const { amountRaised, amountGoal } = goalSums;

      if (amountRaised >= amountGoal) {
        await this.update(userId, id, { isArchive: true });
      }
    }
  }

  async update(userId: string, id: string, updateGoalDto: UpdateGoalDto) {
    const { isReset, ...updateData } = updateGoalDto;

    if (isReset) {
      const columns = getDefaultValues(this.goalsRepository, [
        'title',
        'amountGoal',
        'isArchive',
      ]);
      await this.goalsRepository.update(
        { id, creator: { id: userId } },
        { ...columns },
      );
    } else {
      await this.goalsRepository.update(
        { id, creator: { id: userId } },
        { ...updateData },
      );
    }

    return await this.findOne(id);
  }

  async remove(userId: string, id: string) {
    const { affected } = await this.goalsRepository.softDelete({
      id,
      creator: { id: userId },
    });
    if (!affected) {
      throw new NotFoundException('Widget with this id was not found');
    }
    return { id };
  }
}
