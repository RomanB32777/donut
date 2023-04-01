import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/utils/base';
import { User } from 'src/users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('tokens')
export class AuthToken extends BaseEntity {
  @ApiProperty({ description: 'Token string', readOnly: true, required: true })
  @Index({ unique: true })
  @Column({ unique: true, type: 'text' })
  token: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  public user: User;
}
