import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import {
  IStatData,
  PeriodItemsAll,
  StatsDataTypes,
  statsDataTypes,
  TextAligmnet,
} from 'types';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { BaseEntity } from 'src/utils/base';
import { User } from 'src/users/entities/user.entity';

@Entity('stats')
export class StatWidget
  extends BaseEntity
  implements Omit<IStatData, 'creator'>
{
  @ManyToOne(() => User, (user) => user.stats, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'creator_id', referencedColumnName: 'id' })
  creator!: User;

  @Column({ type: 'varchar', nullable: false })
  @IsString()
  title: string;

  @Column({ type: 'varchar', nullable: false })
  @IsString()
  description: string;

  @Column({ type: 'varchar', nullable: false })
  @IsString()
  template: string;

  @Column({
    type: 'enum',
    enum: StatsDataTypes,
    name: 'data_type',
    nullable: false,
  })
  @IsEnum(StatsDataTypes)
  dataType: statsDataTypes;

  @Column({
    type: 'enum',
    enum: PeriodItemsAll,
    name: 'time_period',
    nullable: false,
  })
  @IsEnum(PeriodItemsAll)
  timePeriod: PeriodItemsAll;

  @Column({
    type: 'varchar',
    name: 'custom_time_period',
    nullable: true,
  })
  @IsString()
  customTimePeriod?: string;

  @Column({
    type: 'enum',
    enum: TextAligmnet,
    name: 'text_aligment',
    default: TextAligmnet.Center,
  })
  @IsEnum(TextAligmnet)
  @IsOptional()
  textAligment: TextAligmnet;

  @Column({ type: 'varchar', name: 'title_color', default: '#ffffff' })
  @IsString()
  @IsOptional()
  titleColor: string;

  @Column({ type: 'varchar', name: 'title_font', default: 'Roboto' })
  @IsString()
  @IsOptional()
  titleFont: string;

  @Column({ type: 'varchar', name: 'content_color', default: '#ffffff' })
  @IsString()
  @IsOptional()
  contentColor: string;

  @Column({ type: 'varchar', name: 'content_font', default: 'Roboto' })
  @IsString()
  @IsOptional()
  contentFont: string;

  @Column({ type: 'varchar', name: 'bar_color', default: '#E94560' })
  @IsString()
  @IsOptional()
  barColor: string;
}
