import { PickType } from '@nestjs/swagger';
import { IsString, IsEnum, IsEmail, IsOptional } from 'class-validator';
import { UserRoles, userRoles, userStatus } from 'types';

import { User } from 'src/users/entities/user.entity';
import { userValidationMessages } from 'src/common/const';

export class QueryUserDto extends PickType(User, [
  'id',
  'walletAddress',
  'username',
  'email',
  'status',
  'roleplay',
]) {
  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  @IsOptional()
  walletAddress: string;

  @IsString()
  @IsOptional()
  username: string;

  @IsEmail(
    {},
    {
      message: ({ property }) =>
        `${property}: ${userValidationMessages?.email?.notValid}`,
    },
  )
  @IsOptional()
  email: string;

  @IsEnum(UserRoles)
  @IsOptional()
  status: userStatus;

  @IsEnum(UserRoles)
  @IsOptional()
  roleplay: userRoles;
}

export type QueryRole = Partial<Pick<QueryUserDto, 'roleplay'>>;
