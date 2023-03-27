import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import Web3Token from 'web3-token';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers?.authorization;

      if (!token) {
        const errPayload = new UnauthorizedException('Missing auth token');
        next(errPayload);
      }

      const { address } = Web3Token.verify(token);
      const { body, params } = req;
      const reqAddress =
        body.address ||
        body.walletAddress ||
        params.address ||
        params.walletAddress;

      if (reqAddress && reqAddress.toLowerCase() !== address.toLowerCase()) {
        const errPayload = new UnauthorizedException('Auth token invalid');
        next(errPayload);
      } else next();
    } catch (error) {
      const errPayload = new UnauthorizedException('Auth token invalid');
      next(errPayload);
    }
  }
}
