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

import { UserInfo } from 'src/auth/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { AuthenticationGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';

@ApiTags('Donation goals')
@Controller('widgets/goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post()
  @Roles('creators')
  @UseGuards(RolesGuard)
  @UseGuards(AuthenticationGuard)
  create(@UserInfo() user: User, @Body() createGoalDto: CreateGoalDto) {
    return this.goalsService.create(user, createGoalDto);
  }

  @Get(':userId')
  findAll(
    @Param('userId') userId: string,
    @Query() { isArchive }: Pick<CreateGoalDto, 'isArchive'>,
  ) {
    return this.goalsService.findAll(userId, isArchive);
  }

  @Get(':username/:id')
  findOne(@Param('username') username: string, @Param('id') id: string) {
    return this.goalsService.findOne(id, username);
  }

  @Patch(':id')
  @Roles('creators')
  @UseGuards(RolesGuard)
  @UseGuards(AuthenticationGuard)
  update(
    @UserInfo('id') userId: string,
    @Param('id') id: string,
    @Body() updateGoalDto: UpdateGoalDto,
  ) {
    return this.goalsService.update(userId, id, updateGoalDto);
  }

  @Delete(':id')
  @Roles('creators')
  @UseGuards(RolesGuard)
  @UseGuards(AuthenticationGuard)
  remove(@UserInfo('id') userId: string, @Param('id') id: string) {
    return this.goalsService.remove(userId, id);
  }
}
