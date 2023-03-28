import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthenticationGuard } from 'src/auth/guards/auth.guard';
import { UserInfo } from 'src/auth/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { QueryNotificationParamsDto } from './dto/query-params.dto';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @UseGuards(AuthenticationGuard)
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get(':username')
  findAll(
    @Param('username') username: string,
    @Query() queryParams: QueryNotificationParamsDto,
  ) {
    return this.notificationsService.findAll(username, queryParams);
  }

  @Patch(':id')
  @UseGuards(AuthenticationGuard)
  updateStatus(@UserInfo('id') userId: string, @Param('id') id: string) {
    return this.notificationsService.updateStatus(userId, [id], { read: true });
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard)
  remove(@UserInfo('id') userId: string, @Param('id') id: string) {
    return this.notificationsService.remove(userId, [id]);
  }

  @Delete()
  @UseGuards(AuthenticationGuard)
  removeAll(@UserInfo() user: User) {
    return this.notificationsService.removeAll(user);
  }
}
