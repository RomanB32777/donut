import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotAcceptableException,
	UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Cron, CronExpression } from '@nestjs/schedule'
import { compare, hash } from 'bcrypt'

import { MailService } from 'src/mail/mail.service'
import { UsersService } from 'src/users/users.service'
import { CreateUserDto } from 'src/users/dto/create-user.dto'
import { User } from 'src/users/entities/user.entity'

import { UserLoginDto, UserTokenPayloadDto } from './dto/user-payload.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { AuthToken } from './entities/token.entity'
import { ConfirmQueryDto, confirmQueryKeys } from './dto/confirm-query.dto'

@Injectable()
export class AuthService {
	private readonly clientUrl: string

	constructor(
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService,
		private readonly mailService: MailService,
		private readonly usersService: UsersService,

		@InjectRepository(AuthToken)
		private tokensRepository: Repository<AuthToken>,
	) {
		this.clientUrl = configService.get<string>('FRONT_HOST')
		// this.confirmClientLink = `${this.clientUrl}/admin/dashboard?confirmStatus`;
	}

	async login(userDto: UserLoginDto) {
		const { email, password } = userDto
		const { password: userPassword, ...user } = await this.usersService.getUserByEmail(email)

		const passwordEquals = await compare(password, userPassword)

		if (passwordEquals) {
			const { token } = await this.generateToken({ ...user, password }, false)
			return { ...user, access_token: token }
		}
		throw new NotAcceptableException('Incorrect email or password')
	}

	async registration(registerUserDto: CreateUserDto, confirmLink: string) {
		try {
			const { email, username, password } = registerUserDto
			const isExistEmail = await this.usersService.checkUserExist(email)
			const isExistUsername = await this.usersService.checkUserExist(username)

			if (isExistEmail || isExistUsername) {
				const errors = []
				if (isExistEmail) {
					errors.push('email: User with this email address already exists')
				}
				if (isExistUsername) {
					errors.push('username: User with this username address already exists')
				}
				throw new BadRequestException(errors)
			}

			const user = await this.setPassword(registerUserDto, password)
			await this.sendConfirmLetter(user, confirmLink)

			const { password: userPassword, ...newUser } = user
			return newUser
		} catch (error) {
			console.log('registration error', error)
			const { email } = registerUserDto
			await this.usersService.removeByEmail(email)
			throw new InternalServerErrorException('Registration error - again auth, please')
		}
	}

	async sendConfirmLetter(user: User, confirmLink: string) {
		const { email } = user
		const { id } = await this.generateToken(user)

		const confirmQueries: Record<confirmQueryKeys, string> = {
			email,
			token: id,
		}

		const queryString = Object.entries(confirmQueries)
			.map(([key, value]) => `${key}=${value}`)
			.join('&')

		await this.mailService.sendMail({
			to: email,
			subject: 'Confirm your email',
			template: 'confirm',
			context: {
				link: [confirmLink, queryString].join('?'),
			},
		})
	}

	async resendConfirmLetter(email: string, confirmLink: string) {
		const user = await this.usersService.getUserByEmail(email)
		if (user.status === 'active') {
			throw new BadRequestException(`Account with email ${email} already activated`)
		}
		await this.sendConfirmLetter(user, confirmLink)
	}

	async generateToken(user: User, dbSaving = true) {
		const { id, email, roleplay, username, status } = user
		const tokenPayload: UserTokenPayloadDto = {
			id,
			email,
			status,
			roleplay,
			username,
		}
		const token = this.jwtService.sign(tokenPayload)

		if (dbSaving) {
			return await this.tokensRepository.save({ token, user })
		}
		return { ...tokenPayload, token }
	}

	async confirm({ email, token: tokenId }: ConfirmQueryDto) {
		try {
			const { verify_data } = await this.checkToken(tokenId)
			const updatedUser = await this.usersService.update(verify_data.id, {
				status: 'active',
			})
			await this.deleteOne(tokenId)

			const { id: updatedTokenId } = await this.generateToken(updatedUser)

			return `${this.clientUrl}?confirmStatus=${
				updatedUser.status === 'active'
			}&token=${updatedTokenId}`
		} catch (error) {
			console.log(error)
			return `${this.clientUrl}?confirmStatus=false&email=${email}`
		}
	}

	async setPassword(userInfo: ResetPasswordDto, password: string, userId?: string) {
		const hashPassword = await hash(password, 5)

		if (userId) {
			return await this.usersService.update(userId, {
				password: hashPassword,
			})
		}
		return await this.usersService.create({
			...userInfo,
			password: hashPassword,
		})
	}

	async resetPassword(email: string) {
		const user = await this.usersService.getUserByEmail(email)
		const { id } = await this.generateToken(user)
		const resetLink = `${this.clientUrl}/change?token=${id}`
		await this.mailService.sendMail({
			to: email,
			subject: 'Reset password',
			template: 'reset',
			context: {
				user,
				link: resetLink,
			},
		})
	}

	async changePassword(user: UserTokenPayloadDto, password: string, authToken: string) {
		const { id } = user

		// set new password
		const updatedUser = await this.setPassword(user, password, id)

		// deleting the old password reset token
		await this.tokensRepository.delete({ token: authToken })

		// create new access token
		const { token } = await this.generateToken(updatedUser)
		return { access_token: token }
	}

	async verifyToken(token: string) {
		try {
			return await this.jwtService.verifyAsync<UserTokenPayloadDto>(token)
		} catch (error) {
			throw new UnauthorizedException('Token not valid - log in again')
		}
	}

	async checkToken(tokenId: string) {
		try {
			const { token } = await this.tokensRepository.findOneByOrFail({
				id: tokenId,
			})
			const verify_data = await this.verifyToken(token)
			return {
				verify_data,
				access_token: token,
			}
		} catch (error) {
			await this.deleteOne(tokenId)
			throw new BadRequestException('Auth token problem')
		}
	}

	async deleteOne(tokenId: string) {
		return await this.tokensRepository.delete({ id: tokenId })
	}

	@Cron(CronExpression.EVERY_DAY_AT_10AM)
	async checkExpirationTokens() {
		const tokens = await this.tokensRepository.find()
		for await (const { token, id } of tokens) {
			// ???
			this.verifyToken(token).catch(async (err) => {
				console.log(err)
				await this.deleteOne(id)
			})
		}
		// const now = new Date(new Date().toISOString());
		// where: { createdAt: MoreThanOrEqual(addDays(now, -1)) },
	}
}
