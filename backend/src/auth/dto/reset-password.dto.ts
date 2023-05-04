import { OmitType, PickType } from '@nestjs/swagger'
import { CreateUserDto } from 'src/users/dto/create-user.dto'

export class ResetPasswordDto extends OmitType(CreateUserDto, ['password']) {}

export class EmaiBodyDto extends PickType(CreateUserDto, ['email']) {}

export class ResetPasswordBodyDto extends PickType(CreateUserDto, ['password']) {}
