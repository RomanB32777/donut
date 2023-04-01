import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  AfterLoad,
} from 'typeorm';
import { notificationRoles, NotificationRoles } from 'types';

import { BaseEntity } from 'src/utils/base';
import { User } from 'src/users/entities/user.entity';
import { Badge } from 'src/badges/entities/badge.entity';
import { Donation } from 'src/donations/entities/donation.entity';

@Entity('notifications')
export class Notification extends BaseEntity {
  @OneToOne(() => Badge, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'badge_id' })
  badge: Badge;

  @OneToOne(() => Donation, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'donation_id' })
  donation: Donation;

  @OneToMany(() => NotificationsUsers, (nu) => nu.notification, {
    cascade: true,
  })
  public users: NotificationsUsers[];

  @AfterLoad()
  checkAnonymous() {
    if (this.donation && this.donation.isAnonymous) {
      this.users = this.users.map((userNotification) => {
        const { roleplay, user } = userNotification;
        if (roleplay === 'sender') {
          return {
            ...userNotification,
            user: { ...user, username: 'anonymous' },
          };
        }
        return userNotification;
      });
    }
  }
}

@Entity('notifications_users')
export class NotificationsUsers {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({
    type: 'enum',
    enum: NotificationRoles,
    default: NotificationRoles.recipient,
  })
  roleplay: notificationRoles;

  @ManyToOne(() => User, (user) => user.notifications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  public user: User;

  @ManyToOne(() => Notification, (notification) => notification.users, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'notification_id', referencedColumnName: 'id' })
  public notification?: Notification;

  @Column({ type: 'boolean', default: false })
  read?: boolean;

  @Column({ type: 'boolean', default: true })
  visible?: boolean;
}
