import { Module } from '@nestjs/common';
import { AlertsModule } from './alerts/alerts.module';
import { StatsModule } from './stats/stats.module';
import { GoalsModule } from './goals/goals.module';

@Module({
  imports: [AlertsModule, StatsModule, GoalsModule],
  exports: [GoalsModule],
})
export class WidgetsModule {}
