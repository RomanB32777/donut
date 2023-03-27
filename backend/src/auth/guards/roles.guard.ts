import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { userRoles } from 'types';

import { User } from 'src/users/entities/user.entity';
import { rolesKey } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<userRoles[]>(
      rolesKey,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    if (user) {
      const { roleplay } = user as User;
      return requiredRoles.includes(roleplay);
    }
    return false;
  }
}
