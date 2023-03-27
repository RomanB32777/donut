import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { GoalsService } from 'src/widgets/goals/goals.service';
import { User } from 'src/users/entities/user.entity';
import { QueryParamsDto } from 'src/common/dto/query-params.dto';

import { CreateDonationDto } from './dto/create-donation.dto';
import { Donation } from './entities/donation.entity';
import { relationUserType } from './widgets/dto/donations-widgets.dto';
import { WidgetsService } from './widgets/widgets.service';
import { falseValues } from 'src/common/const';

@Injectable()
export class DonationsService {
  constructor(
    @InjectRepository(Donation)
    private donationsRepository: Repository<Donation>,

    private readonly goalsService: GoalsService,
    private readonly widgetsService: WidgetsService,
  ) {}

  async create(createDonationDto: CreateDonationDto) {
    const { goal: selectedGoal, ...createDonationInfo } = createDonationDto;

    const donationInfo = this.donationsRepository.create(createDonationInfo);

    if (selectedGoal && !falseValues.includes(selectedGoal)) {
      const goalWidget = await this.goalsService.findOne(selectedGoal);
      donationInfo.goal = goalWidget;
    }

    const newDonation = await this.donationsRepository.save(donationInfo);

    if (donationInfo?.goal) {
      const { creator, goal } = await this.findOne(newDonation.id);
      if (!goal.isArchive) {
        await this.goalsService.checkGoalRelevance(creator.id, goal.id);
      }
    }

    return newDonation;
  }

  async findAll(userId: string) {
    return await this.donationsRepository.find({
      select: {
        creator: {
          id: true,
          username: true,
          walletAddress: true,
        },
        backer: {
          id: true,
          username: true,
          walletAddress: true,
        },
      },
      where: [{ creator: { id: userId } }, { backer: { id: userId } }],
      relations: {
        creator: true,
        backer: true,
        goal: true,
      },
    });
  }

  async getSupporters(userId: string) {
    // return await this.donationsRepository
    //   .createQueryBuilder('donation')
    //   .select('backer.username', 'username')
    //   .select('backer.walletAddress', 'walletAddress')
    //   .leftJoin('donation.backer', 'backer')
    //   .where('donation.creator = :creator', { creator: userId })
    //   .andWhere('donation.isAnonymous = :isAnonymous', { isAnonymous: false })
    //   .groupBy('username')
    //   .getRawMany();
    return await this.donationsRepository
      .createQueryBuilder('donation')
      .select('supporters.username', 'username')
      .addSelect('userInfo.walletAddress', 'walletAddress')
      .from(
        (qb) =>
          qb
            .select('backer.username', 'username')
            .from(Donation, 'donation')
            .leftJoin('donation.backer', 'backer')
            .where('donation.creator = :creator', { creator: userId })
            .andWhere('donation.isAnonymous = :isAnonymous', {
              isAnonymous: false,
            })
            .groupBy('username'),
        'supporters',
      )
      // TODO - remove repeating users without/with distinct
      .leftJoin(User, 'userInfo', 'supporters.username = userInfo.username')
      .distinct()
      .getRawMany();
  }

  async getPageDonations(user: User, queryParams: QueryParamsDto) {
    const { id: userId, roleplay } = user;
    const { groupByName, searchStr } = queryParams;

    if (groupByName) {
      const groupInfo = await this.widgetsService.getTopSupporters(
        userId,
        queryParams,
        true,
      );

      if (!Array.isArray(groupInfo)) {
        if (searchStr) {
          groupInfo.andWhere('groups.username ILIKE :username', {
            username: `%${searchStr}%`,
          });
        }
        return await groupInfo.getRawMany();
      }
    }

    const isCreator = roleplay === 'creators';
    const relationUser: relationUserType = isCreator ? 'backer' : 'creator';

    return await this.widgetsService.findDonationsWithoutQueryBuilder({
      relationUser,
      findUser: { type: isCreator ? 'creator' : 'backer', userId },
      queryParams,
      additionalWhereFilter: searchStr
        ? { [relationUser]: { username: ILike(`%${searchStr}%`) } }
        : {},
    });
  }

  async findOne(id: string) {
    return await this.donationsRepository.findOne({
      where: { id },
      relations: {
        creator: true,
        backer: true,
        goal: true,
      },
    });
  }
}
