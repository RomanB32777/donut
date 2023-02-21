import { NextFunction, Request, Response } from 'express';
import { HttpCode } from '../types.js';

class HttpException extends Error {
  status: number;
  message: string;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

const errorMiddleware = (error: HttpException, request: Request, response: Response, next: NextFunction) => {
  const status = error.status || HttpCode.INTERNAL_SERVER_ERROR;
  const message = error.message || 'Something went wrong';
  response.status(status).json({
    status,
    message,
  });
};

export default errorMiddleware;
