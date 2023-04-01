import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindManyOptions,
  Repository,
  DataSource,
  FindOptionsWhere,
} from 'typeorm';

import { clean } from 'src/utils/badWords';
import { getTimePeriod, dateTruncParams } from 'src/utils/dates';
import { QueryParamsDto } from 'src/common/dto/query-params.dto';
import { Donation } from '../entities/donation.entity';
import { ExchangeService } from '../exchange/exchange.service';
import { ParamsWithoutQueryBuilderDto } from './dto/donations-widgets.dto';

@Injectable()
export class WidgetsService {
  constructor(
    @InjectRepository(Donation)
    private donationsRepository: Repository<Donation>,

    private readonly exchangeService: ExchangeService,

    private dataSource: DataSource,
  ) {}

  async findDonationsWithoutQueryBuilder({
    relationUser,
    findUser,
    queryParams,
    additionalWhereFilter,
  }: ParamsWithoutQueryBuilderDto) {
    const { userId, type: findTypeUser } = findUser;
    const { limit, timePeriod, startDate, endDate, spamFilter } = queryParams;

    const where: FindOptionsWhere<Donation> = {
      [findTypeUser]: { id: userId },
      ...additionalWhereFilter,
    };

    const filter: FindManyOptions<Donation> = {
      select: {
        id: true,
        sum: true,
        message: true,
        blockchain: true,
        createdAt: true,
        isAnonymous: true,
        // [relationUser]: {
        creator: {
          username: true,
        },
        backer: {
          username: true,
        },
      },
      relations: {
        creator: true,
        backer: true,
        // [relationUser]: true,
      },
      where,
      order: { createdAt: 'DESC' },
      take: limit,
    };

    if (timePeriod) {
      filter.where = {
        ...filter.where,
        createdAt: getTimePeriod({
          timePeriod,
          startDate,
          endDate,
        }),
      };
    }
    const donations = await this.donationsRepository.find(filter);

    if (donations.length) {
      const exchanges = await this.exchangeService.getExchange();

      const filterDonations = donations.map((donation) => {
        const { sum, blockchain, backer, isAnonymous } = donation;
        return {
          ...donation,
          sum: sum * exchanges[blockchain],
          blockchainSum: sum,
          backer: {
            ...backer,
            username: isAnonymous ? 'anonymous' : backer.username,
          },
        };
      });

      if (spamFilter) {
        return filterDonations.map((donation) => ({
          ...donation,
          message: donation.message ? clean(donation.message) : '-',
        }));
      }

      return filterDonations;
    }
    return donations;
  }

  async getTopDonations(userId: string, queryParams: QueryParamsDto) {
    const { limit, timePeriod, startDate, endDate, spamFilter } = queryParams;

    const filter: FindManyOptions<Donation> = {
      select: {
        id: true,
        sum: true,
        message: true,
        blockchain: true,
        createdAt: true,
        backer: {
          username: true,
        },
      },
      relations: {
        backer: true,
      },
      where: { creator: { id: userId } },
      order: { sum: 'DESC' },
      take: limit,
    };

    if (timePeriod) {
      filter.where = {
        ...filter.where,
        createdAt: getTimePeriod({
          timePeriod,
          startDate,
          endDate,
        }),
      };
    }

    const donations = await this.donationsRepository.find(filter);

    if (donations.length && spamFilter)
      return donations.map((donation) => ({
        ...donation,
        // TODO - clean to AfterLoad
        message: donation.message ? clean(donation.message) : '-',
      }));

    return donations;
  }

  async getLatestDonations(userId: string, queryParams: QueryParamsDto) {
    return await this.findDonationsWithoutQueryBuilder({
      relationUser: 'backer',
      findUser: { type: 'creator', userId },
      queryParams,
    });
  }

  async getTopSupporters(
    userId: string,
    queryParams: QueryParamsDto,
    isGetQueryFormat = false,
  ) {
    const { timePeriod } = queryParams;

    const sumSelect = await this.exchangeService.sumQuerySelect();

    const notAnonymous = this.donationsRepository
      .createQueryBuilder('d')
      .select('backer.username', 'username')
      .addSelect(sumSelect, 'sum')
      .leftJoin('d.backer', 'backer')
      .where('d.isAnonymous = false')
      .andWhere('d.creator = :userId', { userId })
      .groupBy('username')
      .orderBy('sum', 'DESC');

    const anonymous = this.donationsRepository
      .createQueryBuilder('d')
      .select("'anonymous'", 'username')
      .addSelect(sumSelect, 'sum')
      .where('d.isAnonymous = true')
      .andWhere('d.creator = :userId', { userId });

    if (timePeriod !== 'all') {
      notAnonymous.andWhere('d.createdAt >= :filterDate', {
        filterDate: getTimePeriod({ timePeriod }).value,
      });
      anonymous.andWhere('d.createdAt >= :filterDate', {
        filterDate: getTimePeriod({ timePeriod }).value,
      });
    }

    const parameters = notAnonymous.getParameters();
    const queryString = `(${anonymous.getQuery()} UNION ${notAnonymous.getQuery()})`;

    const topSupportersQuery = this.dataSource
      .createQueryBuilder()
      .select('groups.username', 'username')
      .addSelect('groups.sum', 'sum')
      .from(queryString, 'groups')
      .setParameters(parameters)
      .where('groups.sum > 0');

    if (isGetQueryFormat) return topSupportersQuery;

    return await topSupportersQuery.getRawMany();
  }

  async getStatsDonations(userId: string, queryParams: QueryParamsDto) {
    const { timePeriod } = queryParams;

    if (!timePeriod) {
      throw new BadRequestException(
        'Time period (query parameter - timePeriod) is required!',
      );
    }

    const sumSelect = await this.exchangeService.sumQuerySelect();

    return await this.donationsRepository
      .createQueryBuilder('d')
      .select(
        `DATE_TRUNC('${dateTruncParams[timePeriod]}', d.createdAt)`,
        'date_group',
      )
      .addSelect(sumSelect, 'sum')
      .where('d.creator = :userId', { userId })
      .andWhere('d.createdAt >= :filterDate', {
        filterDate: getTimePeriod({ timePeriod }).value,
      })
      .groupBy('date_group')
      .orderBy('date_group', 'ASC')
      .getRawMany();
  }
}
