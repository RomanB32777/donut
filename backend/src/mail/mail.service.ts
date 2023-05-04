import { MailerService } from '@nestjs-modules/mailer'
import { Injectable, InternalServerErrorException } from '@nestjs/common'

import { SendMailDto } from './dto/send-mail.dto'

@Injectable()
export class MailService {
	constructor(private readonly mailerService: MailerService) {}

	async sendMail(sendMailDto: SendMailDto) {
		try {
			const res = await this.mailerService.sendMail(sendMailDto)
			console.log(res)
		} catch (error) {
			console.log('send error', error)
			throw new InternalServerErrorException(`send error - ${error}`)
		}
	}
}
