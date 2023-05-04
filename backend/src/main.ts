import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'

import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		cors: true,
	})
	const config = app.get(ConfigService)
	const port = config.get<number>('API_PORT') || 3000

	app.setGlobalPrefix('api')

	const options = new DocumentBuilder()
		.setTitle('Crypto Donutz Api')
		.addBearerAuth({ type: 'http', in: 'header' }, 'authorization')
		.setVersion('1.0')
		.build()

	const document = SwaggerModule.createDocument(app, options)
	SwaggerModule.setup('api/docs', app, document)

	app.useGlobalPipes(new ValidationPipe({ transform: true }))

	await app.listen(port, () => console.log(`App has been started on port ${port}...`))
}
bootstrap()
