import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { BlockchainsSymbols, blockchainsSymbols, IDonation } from 'types';

import { BaseEntity } from 'src/utils/base';
import { User } from 'src/users/entities/user.entity';
import { GoalWidget } from 'src/widgets/goals/entities/goal-widget.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('donations')
export class Donation
  extends BaseEntity
  implements Omit<IDonation, 'backer' | 'creator' | 'goal'>
{
  @ApiProperty({
    description: 'The one to whom the donation is sent - creator',
    required: true,
    type: () => User,
  })
  @ManyToOne(() => User, (user) => user.id, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'creator_id', referencedColumnName: 'id' })
  creator!: User;

  @ApiProperty({
    description: 'the one who sends the donation - supporter',
    required: true,
    type: () => User,
  })
  @ManyToOne(() => User, (user) => user.id, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'backer_id', referencedColumnName: 'id' })
  backer!: User;

  @ApiProperty({
    description: 'Donation goal',
    required: false,
    type: () => GoalWidget,
  })
  @ManyToOne(() => GoalWidget, (goal) => goal.id, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'goal_id', referencedColumnName: 'id' })
  goal?: GoalWidget;

  @ApiProperty({
    description: 'Donation amount',
    required: true,
  })
  @Column({
    type: 'real',
    nullable: false,
    transformer: {
      to: (value: number) => value,
      from: (value) => Number(value),
    },
  })
  @IsNumber()
  @Min(0)
  sum: number;

  @ApiProperty({
    description: 'Through which blockchain the transaction was made',
    required: true,
    enum: BlockchainsSymbols,
  })
  @Column({ type: 'enum', enum: BlockchainsSymbols, nullable: false })
  @IsEnum(BlockchainsSymbols)
  blockchain: blockchainsSymbols;

  @ApiProperty({
    description: 'Attached message to donation',
    required: true,
  })
  @Column({ type: 'varchar', nullable: false })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Whether the donation was sent anonymously',
    default: false,
  })
  @Column({ type: 'boolean', name: 'is_anonymous', default: false })
  @IsBoolean()
  @IsOptional()
  isAnonymous: boolean;
}
