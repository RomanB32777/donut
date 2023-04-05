import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { clean } from 'src/utils/badWords';
import { User } from 'src/users/entities/user.entity';
import {
  Notification,
  NotificationsUsers,
} from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateUserNotificationDto } from './dto/update-notification.dto';
import { QueryNotificationParamsDto } from './dto/query-params.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    const notification = new Notification();
    notification.donation = createNotificationDto.donation;
    notification.badge = createNotificationDto.badge;
    notification.users = createNotificationDto.users;

    const notificationsUser = createNotificationDto.users.map(
      ({ user, roleplay }) => {
        const notificationUser = new NotificationsUsers();
        notificationUser.user = user;
        notificationUser.roleplay = roleplay;
        return notificationUser;
      },
    );

    notification.users = notificationsUser;
    return await this.notificationsRepository.save(notification);
  }

  async findById(ids: string[]) {
    return await this.notificationsRepository.find({
      where: { id: In(ids) },
      relations: {
        users: {
          user: true,
        },
      },
    });
  }

  async findAll(username: string, queryParams?: QueryNotificationParamsDto) {
    const selectedNotifications = await this.notificationsRepository.find({
      select: {
        id: true,
        users: {
          visible: true,
          user: { id: true },
        },
      },
      where: { users: { visible: true, user: { username } } },
      relations: { users: { user: true } },
    });

    if (selectedNotifications.length && queryParams) {
      const { limit, offset, sort, sortDirection, spamFilter } = queryParams;
      const fullNotifications = await this.notificationsRepository.find({
        select: {
          id: true,
          createdAt: true,
          donation: {
            sum: true,
            message: true,
            blockchain: true,
            isAnonymous: true,
            goal: {
              id: true,
            },
          },
          badge: {
            id: true,
            title: true,
          },
          users: {
            read: true,
            roleplay: true,
            visible: true,
            user: {
              username: true,
            },
          },
        },
        relations: {
          donation: {
            goal: true,
          },
          badge: true,
          users: {
            user: true,
          },
        },
        where: { id: In(selectedNotifications.map((n) => n.id)) },
        order: { [sort || 'createdAt']: sortDirection || 'DESC' },
        take: limit,
        skip: offset,
      });

      if (spamFilter && fullNotifications.length) {
        return fullNotifications.map((notification) => {
          const { donation } = notification;
          if (donation) {
            const { message } = donation;
            notification.donation.message = message ? clean(message) : '-';
            return notification;
          }
          return notification;
        });
      }

      return fullNotifications;
    }

    return selectedNotifications;
  }

  async updateStatus(
    userId: string,
    ids: string[],
    updateNotificationDto: UpdateUserNotificationDto,
  ) {
    const notifications = await this.findById(ids);

    for await (const notification of notifications) {
      notification.users = notification.users.map((nu) => {
        if (nu.user.id === userId) return { ...nu, ...updateNotificationDto };
        return nu;
      });
      await this.notificationsRepository.save(notification);
    }

    return notifications;
  }

  async remove(userId: string, ids: string[]) {
    const notVisibleNotifications = await this.updateStatus(userId, ids, {
      visible: false,
    });

    const countVisible = this.notificationsRepository
      .createQueryBuilder('n')
      .select('n.id', 'id')
      .leftJoin('n.users', 'nu')
      .where('nu.notification IN (:...ids)', { ids })
      .andWhere('nu.visible = :visible', { visible: false })
      .groupBy('n.id')
      .having('COUNT(*) > 1');

    const query = `(${countVisible.getQuery()})`;
    const parameters = countVisible.getParameters();

    await this.notificationsRepository
      .createQueryBuilder()
      .delete()
      .where(`id IN ${query}`)
      .setParameters(parameters)
      .execute();

    return notVisibleNotifications;
  }

  async removeAll({ username, id: userId }: User) {
    const notifications = await this.findAll(username);
    if (notifications.length) {
      const ids = notifications.map(({ id }) => id);
      return await this.remove(userId, ids);
    }
    return notifications;
  }
}
