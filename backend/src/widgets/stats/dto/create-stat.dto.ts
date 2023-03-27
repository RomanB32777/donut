import { PartialType } from '@nestjs/swagger';
import { StatWidget } from '../entities/stat-widget.entity';

export class CreateStatDto extends PartialType(StatWidget) {}
