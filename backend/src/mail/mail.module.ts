import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MailerModule } from '@nestjs-modules/mailer'
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter'

import { MailService } from './mail.service'
import { MailController } from './mail.controller'
import { join } from 'path'

@Module({
	imports: [
		MailerModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (config: ConfigService) => {
				const transport = config.get<string>('MAIL_TRANSPORT')
				const mailFromName = config.get<string>('MAIL_FROM_NAME')
				const mailFromAddress = transport.split(':')[1].split('//')[1]

				return {
					transport,
					defaults: {
						from: `"${mailFromName}" <${mailFromAddress}>`,
					},
					template: {
						dir: join(__dirname, '..', '..', 'mail', 'templates'),
						adapter: new PugAdapter(),
						options: {
							strict: true,
						},
					},
				}
			},
		}),
	],
	controllers: [MailController],
	providers: [MailService],
	exports: [MailService],
})
export class MailModule {}
