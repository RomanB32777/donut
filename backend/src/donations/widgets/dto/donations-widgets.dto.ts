import { FindOptionsWhere } from 'typeorm';
import { Donation } from 'src/donations/entities/donation.entity';
import { QueryParamsDto } from 'src/common/dto/query-params.dto';

export type relationUserType = 'creator' | 'backer';

export class ParamsWithoutQueryBuilderDto {
  findUser: { userId: string; type: relationUserType };
  relationUser?: relationUserType; // TODO - нужно ли ?
  queryParams: QueryParamsDto;
  additionalWhereFilter?: FindOptionsWhere<Donation>;
}
