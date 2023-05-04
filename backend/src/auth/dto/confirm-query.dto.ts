import { IsEmail, IsString } from 'class-validator'

export class ConfirmQueryDto {
	@IsEmail()
	email: string

	@IsString()
	token: string
}

export type confirmQueryKeys = keyof ConfirmQueryDto
