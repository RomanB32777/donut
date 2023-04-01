import { Column, Entity, OneToOne, JoinColumn } from 'typeorm';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Genders, IAlertData } from 'types';

import { BaseEntity } from 'src/utils/base';
import { User } from 'src/users/entities/user.entity';

@Entity('alerts')
export class AlertWidget
  extends BaseEntity
  implements Omit<IAlertData, 'creator'>
{
  @OneToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'creator_id' })
  creator!: User;

  @Column({ type: 'varchar', nullable: true, default: '' })
  @IsString()
  @IsOptional()
  banner: string;

  @Column({ type: 'varchar', name: 'message_color', default: '#ffffff' })
  @IsString()
  @IsOptional()
  messageColor: string;

  @Column({ type: 'varchar', name: 'message_font', default: 'Roboto' })
  @IsString()
  @IsOptional()
  messageFont: string;

  @Column({ type: 'varchar', name: 'nameColor', default: '#ffffff' })
  @IsString()
  @IsOptional()
  nameColor: string;

  @Column({ type: 'varchar', name: 'name_font', default: 'Roboto' })
  @IsString()
  @IsOptional()
  nameFont: string;

  @Column({ type: 'varchar', name: 'sum_color', default: '#ffffff' })
  @IsString()
  @IsOptional()
  sumColor: string;

  @Column({ type: 'varchar', name: 'sum_font', default: 'Roboto' })
  @IsString()
  @IsOptional()
  sumFont: string;

  @Column({ type: 'integer', default: 10 })
  @IsNumber()
  @Min(3)
  @Max(10)
  @IsOptional()
  duration: number;

  @Column({ type: 'varchar', default: '' })
  @IsString()
  @IsOptional()
  sound: string;

  @Column({ type: 'boolean', default: false })
  @IsBoolean()
  @IsOptional()
  voice: boolean;

  @Column({ type: 'enum', enum: Genders, default: Genders.MALE })
  @IsEnum(Genders)
  @IsOptional()
  genderVoice: Genders;
}
