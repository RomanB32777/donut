import { NextFunction, Request, Response } from 'express';
import Web3Token from 'web3-token';
import { HttpCode } from '../types.js';

const authMiddleware = (req: any, response: Response, next: NextFunction) => {
  try {
    const request = req as Request;
    const token = request.headers?.authorization;

    if (!token)
      return response.status(HttpCode.UNAUTHORIZED).json({
        message: 'Missing auth token',
      });

    const { address } = Web3Token.verify(token);

    const reqAddress =
      request.body.address || request.body.wallet_address || request.params.wallet_address || request.params.address;

    if (reqAddress && reqAddress.toLowerCase() !== address.toLowerCase()) {
      throw 'Invalid address';
    } else next();
  } catch {
    response.status(HttpCode.UNAUTHORIZED).json({
      message: 'Invalid auth token',
    });
  }
};

export default authMiddleware;
