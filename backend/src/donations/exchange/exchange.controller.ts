import { Controller, Get, Post, Body, Param } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { ExchangeService } from './exchange.service'
import { CreateExchangeDto } from './dto/create-exchange.dto'
import { GetExchangeDto } from './dto/get-exchange.dto'

@ApiTags('Exchange')
@Controller('donations/exchange')
export class ExchangeController {
	ƒ
	constructor(private readonly exchangeService: ExchangeService) {}

	@Post()
	create(@Body() createExchangeDto: CreateExchangeDto) {
		return this.exchangeService.addExchange(createExchangeDto)
	}

	@Get()
	findAll() {
		return this.exchangeService.getExchange()
	}

	@Get(':blockchain')
	getExchange(@Param() { blockchain }: GetExchangeDto) {
		return this.exchangeService.getExchangeBlockchain(blockchain)
	}
}
