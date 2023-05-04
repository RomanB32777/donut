import { SetMetadata } from '@nestjs/common'
import { userRoles } from 'types'

export const rolesKey = 'roles'

export const Roles = (...roles: userRoles[]) => SetMetadata(rolesKey, roles)
