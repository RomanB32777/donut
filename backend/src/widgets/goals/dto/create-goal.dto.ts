import { PartialType } from '@nestjs/swagger';
import { GoalWidget } from '../entities/goal-widget.entity';

export class CreateGoalDto extends PartialType(GoalWidget) {}
