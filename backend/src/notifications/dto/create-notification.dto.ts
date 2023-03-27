import { OmitType, PartialType } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { NotificationRoles, notificationRoles } from 'types';

import { User } from 'src/users/entities/user.entity';
import {
  Notification,
  NotificationsUsers,
} from '../entities/notification.entity';

export class CreateUserNotificationDto extends PartialType(NotificationsUsers) {
  @IsEnum(NotificationRoles)
  roleplay!: notificationRoles;

  user!: User;
}

export class CreateNotificationDto extends PartialType(
  OmitType(Notification, ['users']),
) {
  public users: CreateUserNotificationDto[];
}
