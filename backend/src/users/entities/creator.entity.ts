import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ICreatorInfo } from 'types';

import { BaseEntity } from 'src/utils/base';
import { User } from './user.entity';
import { trueValues } from 'src/common/const';

@Entity('creators')
export class Creator extends BaseEntity implements ICreatorInfo {
  @OneToOne(() => User, (user) => user.creator, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({ description: 'Donation page header image - string url' })
  @Column({
    type: 'varchar',
    name: 'header_banner',
    nullable: true,
    default: '',
  })
  @IsString()
  @IsOptional()
  headerBanner: string;

  @ApiProperty({ description: 'Donation page background image - string url' })
  @Column({
    type: 'varchar',
    name: 'background_banner',
    nullable: true,
    default: '',
  })
  @IsString()
  @IsOptional()
  backgroundBanner: string;

  @ApiProperty({
    description: 'Welcome text for donation page',
    example: 'Thank you for being my crypto supporter!',
  })
  @Column({
    type: 'varchar',
    name: 'welcome_text',
    default: 'Thank you for being my crypto supporter!',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  welcomeText: string;

  @ApiProperty({
    description: 'Button text on the donation page',
    example: 'Donate',
  })
  @IsString()
  @IsOptional()
  @Column({ type: 'varchar', name: 'btn_text', default: 'Donate' })
  btnText: string;

  @ApiProperty({
    description: 'The main color of the donation page (button, goals color)',
  })
  @Column({ type: 'varchar', name: 'main_color', default: '#E94560' })
  @IsString()
  @IsOptional()
  mainColor: string;

  @ApiProperty({ description: 'Donation page background color' })
  @Column({ type: 'varchar', name: 'background_color', default: '#1A1A2E' })
  @IsString()
  @IsOptional()
  backgroundColor: string;

  @IsBoolean()
  @Transform(({ value }) => trueValues.includes(value))
  @ApiProperty({ description: 'Spam filter in donation messages' })
  @Column({ type: 'boolean', name: 'spam_filter', default: false })
  @IsOptional()
  spamFilter: boolean;
}
