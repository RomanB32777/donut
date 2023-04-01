import { PartialType } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsNumber, IsString } from 'class-validator';
import { IResetField } from 'types';

import { User } from 'src/users/entities/user.entity';
import { trueValues } from 'src/common/const';
import { CreateGoalDto } from './create-goal.dto';

export class UpdateGoalDto
  extends PartialType(CreateGoalDto)
  implements IResetField
{
  @Exclude()
  creator?: User;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNumber()
  amountGoal?: number;

  @Exclude()
  amountRaised?: number;

  @Exclude()
  isArchive?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => trueValues.includes(value))
  isReset?: boolean;
}
