import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from 'src/users/users.module';
import { GoalsService } from './goals.service';
import { GoalsController } from './goals.controller';
import { GoalWidget } from './entities/goal-widget.entity';
import { ExchangeModule } from 'src/donations/exchange/exchange.module';

@Module({
  imports: [
    UsersModule,
    ExchangeModule,
    TypeOrmModule.forFeature([GoalWidget]),
  ],
  controllers: [GoalsController],
  providers: [GoalsService],
  exports: [GoalsService],
})
export class GoalsModule {}
