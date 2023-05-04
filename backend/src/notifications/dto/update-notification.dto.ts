import { PartialType } from '@nestjs/swagger'
import { CreateUserNotificationDto } from './create-notification.dto'

export class UpdateUserNotificationDto extends PartialType(CreateUserNotificationDto) {}
