import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { IGoalData } from 'types';

import { BaseEntity } from 'src/utils/base';
import { User } from 'src/users/entities/user.entity';
import { Donation } from 'src/donations/entities/donation.entity';

@Entity('goals')
export class GoalWidget
  extends BaseEntity
  implements Omit<IGoalData, 'creator' | 'amountRaised'>
{
  @ManyToOne(() => User, (user) => user.goals, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'creator_id', referencedColumnName: 'id' })
  creator!: User;

  @ApiProperty({
    description: 'Donation goal',
    required: false,
    type: () => GoalWidget,
  })
  @OneToMany(() => Donation, (donation) => donation.goal, {
    nullable: true,
  })
  donations?: Donation[];

  @Column({ type: 'varchar', nullable: false, default: '' })
  @IsString()
  title: string;

  @Column({
    type: 'real',
    name: 'amount_goal',
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value) => Number(value),
    },
  })
  @IsNumber()
  amountGoal: number;

  @Column({ type: 'boolean', name: 'is_archive', default: false })
  @IsBoolean()
  @IsOptional()
  isArchive: boolean;

  @Column({ type: 'varchar', name: 'title_color', default: '#ffffff' })
  @IsString()
  @IsOptional()
  titleColor: string;

  @Column({ type: 'varchar', name: 'title_font', default: 'Roboto' })
  @IsString()
  @IsOptional()
  titleFont: string;

  @Column({ type: 'varchar', name: 'progress_color', default: '#E94560' })
  @IsString()
  @IsOptional()
  progressColor: string;

  @Column({ type: 'varchar', name: 'progress_font', default: 'Roboto' })
  @IsString()
  @IsOptional()
  progressFont: string;

  @Column({ type: 'varchar', name: 'background_color', default: '#212127' })
  @IsString()
  @IsOptional()
  backgroundColor: string;
}

export class GoalWidgetWithAmountRaised extends GoalWidget {
  amountRaised: number;
}
