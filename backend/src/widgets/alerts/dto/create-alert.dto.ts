import { OmitType, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsBoolean } from 'class-validator';

import { excludedColumsArr } from 'src/utils/base';
import { trueValues } from 'src/common/const';
import { AlertWidget } from '../entities/alert-widget.entity';

export class CreateAlertDto extends PartialType(
  OmitType(AlertWidget, excludedColumsArr),
) {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  duration?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => trueValues.includes(value))
  voice?: boolean;
}
