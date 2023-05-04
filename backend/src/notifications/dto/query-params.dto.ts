import { IsEnum, IsOptional } from 'class-validator'
import { NotificationRoles, notificationRoles } from 'types'
import { QueryParamsDto } from 'src/common/dto/query-params.dto'
import { OmitType } from '@nestjs/swagger'

export class QueryNotificationParamsDto extends OmitType(QueryParamsDto, ['roleplay']) {
	@IsEnum(NotificationRoles)
	@IsOptional()
	roleplay: notificationRoles
}
