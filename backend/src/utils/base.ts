import {
	CreateDateColumn,
	UpdateDateColumn,
	PrimaryGeneratedColumn,
	DeleteDateColumn,
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { Exclude } from 'class-transformer'

interface IBaseEntity {
	id: string
	createdAt: Date
	updatedAt: Date
	deletedAt: Date
}

export class BaseEntity implements IBaseEntity {
	@ApiProperty({ description: 'Id - format uuid', required: true })
	@PrimaryGeneratedColumn('uuid')
	@Exclude()
	id!: string

	@ApiProperty({ description: 'Created at', required: true, readOnly: true })
	@CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
	@Exclude()
	createdAt: Date

	@ApiProperty({ description: 'Updated at', required: true, readOnly: true })
	@UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
	@Exclude()
	updatedAt: Date

	@ApiProperty({ description: 'Deleted at', required: true, readOnly: true })
	@DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
	deletedAt: Date
}

type excludedDateColums = keyof Omit<IBaseEntity, 'id'>
type excludedColums = excludedDateColums | 'id'

export const excludedDateColumsArr: excludedDateColums[] = ['createdAt', 'updatedAt', 'deletedAt']

export const excludedColumsArr: excludedColums[] = ['createdAt', 'updatedAt', 'deletedAt', 'id']

export type { excludedColums, excludedDateColums }
