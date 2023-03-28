import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { Genders, IGenerateSoundQuery } from 'types';

export class QuerySoundDto implements IGenerateSoundQuery {
  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty()
  @IsEnum(Genders)
  genderVoice: Genders;

  @ApiProperty()
  @IsString()
  languageCode: string;
}
