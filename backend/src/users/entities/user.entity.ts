import { Entity, Column, OneToMany, OneToOne, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { IUser, UserRoles, userRoles, userStatus, UserStatus } from 'types';

import { BaseEntity } from 'src/utils/base';
import { Donation } from 'src/donations/entities/donation.entity';
import { NotificationsUsers } from 'src/notifications/entities/notification.entity';
import { GoalWidget } from 'src/widgets/goals/entities/goal-widget.entity';
import { StatWidget } from 'src/widgets/stats/entities/stat-widget.entity';
import { AlertWidget } from 'src/widgets/alerts/entities/alert-widget.entity';
import { Creator } from './creator.entity';

@Entity('users')
export class User extends BaseEntity implements IUser {
  @ApiProperty({
    description: 'User wallet address',
    readOnly: true,
  })
  @Column({
    type: 'varchar',
    name: 'wallet_address',
    nullable: true,
  })
  walletAddress: string;

  @ApiProperty({ description: 'Username', required: true })
  @Column({ unique: true, type: 'varchar' })
  username: string;

  @ApiProperty({ description: 'Email', readOnly: true, required: false })
  @Index({ unique: true })
  @Column({ unique: true, type: 'varchar', nullable: true })
  email: string;

  @ApiProperty({ description: 'Password', required: false })
  @Column({ type: 'varchar', nullable: true }) //  select: false
  // @Exclude()
  password: string;

  @ApiProperty({
    description: 'User status',
    required: true,
    enum: UserStatus,
  })
  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.confirmation })
  @IsEnum(UserStatus)
  status: userStatus;

  @ApiProperty({
    description: 'The role of the user is the creator or the backer',
    required: true,
    readOnly: true,
    enum: UserRoles,
  })
  @Column({ type: 'enum', enum: UserRoles, default: UserRoles.creators })
  roleplay: userRoles;

  @ApiProperty({ description: "The path to the user's avatar file" })
  @Column({ type: 'varchar', nullable: true, default: '' })
  @IsString()
  @IsOptional()
  avatarLink: string;

  @OneToOne(() => Creator, (creator) => creator.user, {
    cascade: true,
    nullable: true,
  })
  creator: Creator;

  @OneToOne(() => AlertWidget, (alert) => alert.creator, {
    cascade: true,
    nullable: true,
  })
  alert?: AlertWidget;

  @OneToMany(() => Donation, (donation) => donation.creator, { nullable: true })
  creatorDonations?: Donation[];

  @OneToMany(() => Donation, (donation) => donation.backer, { nullable: true })
  backerDonations?: Donation[];

  @OneToMany(() => GoalWidget, (goal) => goal.creator, { nullable: true })
  goals?: GoalWidget[];

  @OneToMany(() => StatWidget, (stat) => stat.creator, { nullable: true })
  stats?: StatWidget[];

  @OneToMany(() => NotificationsUsers, (nu) => nu.user)
  notifications?: NotificationsUsers[];
}
