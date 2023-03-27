import { OmitType } from '@nestjs/mapped-types';
import { PartialType } from '@nestjs/swagger';

import { excludedColumsArr } from 'src/utils/base';
import { Exchange } from '../entities/exchange.entity';

export class CreateExchangeDto extends PartialType(
  OmitType(Exchange, excludedColumsArr),
) {}
