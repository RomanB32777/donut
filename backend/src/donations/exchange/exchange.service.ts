import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { catchError, lastValueFrom, map } from 'rxjs';
import { BlockchainsSymbols, ExchangeNames } from 'types';

import { Exchange } from './entities/exchange.entity';
import { CreateExchangeDto } from './dto/create-exchange.dto';
import { delay } from 'src/utils';

@Injectable()
export class ExchangeService {
  constructor(
    @InjectRepository(Exchange)
    private exchangeRepository: Repository<Exchange>,

    private readonly axiosService: HttpService,
  ) {}

  async addExchange(
    createExchangeDto: CreateExchangeDto | CreateExchangeDto[],
  ) {
    const updatedAt = { updatedAt: new Date().toISOString() };

    const entityOrEntities = Array.isArray(createExchangeDto)
      ? createExchangeDto.map((exch) => Object.assign(exch, updatedAt))
      : Object.assign(createExchangeDto, updatedAt);

    const { raw } = await this.exchangeRepository.upsert(entityOrEntities, [
      'coin',
    ]);
    return raw;
  }

  async getDbExchange(timeout?: string) {
    const [exchange, count] = await this.exchangeRepository
      .createQueryBuilder('exchange')
      .select(['exchange.coin', 'exchange.price'])
      .where(
        timeout
          ? `DATE_TRUNC(:timeout, exchange.updated_at) =  DATE_TRUNC(:timeout, CURRENT_TIMESTAMP)`
          : '',
        {
          timeout,
        },
      )
      .getManyAndCount();
    return { exchanges: exchange, count };
  }

  async getApiExchange(notFoundExchanges: BlockchainsSymbols[]) {
    const apiExchanges: CreateExchangeDto[] = [];
    for await (const [blockchainName, exchangeName] of Object.entries(
      ExchangeNames,
    )) {
      if (notFoundExchanges.includes(blockchainName as BlockchainsSymbols)) {
        // TODO
        // await delay(1000);
        const apiRequest = this.axiosService
          .get(
            `https://api.coingecko.com/api/v3/simple/price?ids=${exchangeName}&vs_currencies=usd`,
          )
          .pipe(
            map(({ data }) => Number(data[exchangeName].usd)),
            catchError(async (err) => err.code),
          );

        const apiExchange = await lastValueFrom(apiRequest);

        if (typeof apiExchange === 'number') {
          apiExchanges.push({
            coin: blockchainName as BlockchainsSymbols,
            price: apiExchange,
          });
        } else {
          console.log('apiExchange error', apiExchange);
        }
      }
    }
    if (apiExchanges.length) {
      await this.addExchange(apiExchanges);
      return apiExchanges;
    }
    return [];
  }

  async getExchange(): Promise<Record<BlockchainsSymbols, number>> {
    let exchanges = [];
    const { exchanges: dbExchanges, count } = await this.getDbExchange('hour');

    if (count === Object.keys(BlockchainsSymbols).length) {
      exchanges = dbExchanges;
    } else {
      const notFoundExchanges = Object.values(BlockchainsSymbols).filter(
        (symbol) => !dbExchanges.some((exch) => exch.coin === symbol),
      );
      const apiExchanges = await this.getApiExchange(notFoundExchanges);
      exchanges = [
        ...apiExchanges.map(({ price, coin }) => ({ price, coin })),
        ...dbExchanges.filter(({ coin }) => !notFoundExchanges.includes(coin)),
      ];
    }
    return exchanges.reduce(
      (acc, { coin, price }) => ({ ...acc, [coin]: price }),
      {},
    );
  }

  async getExchangeBlockchain(blockchain: BlockchainsSymbols) {
    const exchanges = await this.getExchange();
    return exchanges[blockchain];
  }

  async sumQuerySelect(sumColumn = 'd.sum', blockchainColumn = 'd.blockchain') {
    const exchanges = await this.getExchange();

    return `COALESCE(SUM(${sumColumn} * CASE ${blockchainColumn} ${Object.keys(
      BlockchainsSymbols,
    )
      .map((c) => `WHEN '${c}' THEN ${exchanges[c] || 0}`)
      .join(' ')}
      ELSE 1
      END), 0)`;
  }
}
