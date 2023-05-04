import { Column, Entity } from 'typeorm'
import { Min } from 'class-validator'
import { BaseEntity } from 'src/utils/base'
import { BlockchainsSymbols } from 'types'

@Entity('exchange')
export class Exchange extends BaseEntity {
	@Min(0)
	@Column({
		type: 'real',
		nullable: false,
		transformer: {
			to: (value: number) => value,
			from: (value) => Number(value),
		},
	})
	price: number

	@Column({
		// type: 'varchar',
		unique: true,
		nullable: false,
		type: 'enum',
		enum: BlockchainsSymbols,
	})
	coin: BlockchainsSymbols
}
