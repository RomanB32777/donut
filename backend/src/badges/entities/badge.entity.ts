import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IBadgeInfo } from 'types';

import { BaseEntity } from 'src/utils/base';
import { User } from 'src/users/entities/user.entity';

@Entity('badges')
export class Badge extends BaseEntity implements IBadgeInfo<string, User> {
  @ApiProperty({ description: 'Badge creator', type: () => User })
  @OneToOne(() => User, {
    // cascade: false,
    nullable: false,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'creator_id' })
  creator!: User;

  @ApiProperty({ description: 'Assigned users', type: () => [User] })
  @ManyToMany(() => User, { cascade: true })
  @JoinTable()
  holders: User[];

  @ApiProperty({ description: 'Badge name', required: true })
  @Column({ type: 'varchar' })
  title: string;

  @ApiProperty({
    description: 'Blockchain',
    required: true,
  })
  @Column({ type: 'varchar' })
  blockchain: string;

  @ApiProperty({ description: 'Link to badge image', required: true })
  @Column({ type: 'varchar' })
  image: string;

  @ApiProperty({ description: 'Badge description', required: true })
  @Column({ type: 'varchar' })
  description: string;

  @ApiProperty({ description: 'Token ???' })
  @Column({ type: 'integer', name: 'token_id', nullable: true })
  tokenId?: number;

  // @AfterLoad()
  // setComputed() {
  //   this.testField = this.oneField + this.secondField;
  // }
}
