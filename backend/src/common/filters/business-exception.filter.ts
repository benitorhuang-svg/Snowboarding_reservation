import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

export class BusinessException extends Error {
  constructor(
    public readonly message: string,
    public readonly error_code: string,
    public readonly status: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super(message);
  }
}

interface HttpExceptionResponse {
  message?: string | string[];
}

@Catch()
export class BusinessExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error_code = 'SYS_000';

    if (exception instanceof BusinessException) {
      status = exception.status;
      message = exception.message;
      error_code = exception.error_code;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse() as HttpExceptionResponse;
      message =
        typeof res === 'string'
          ? res
          : Array.isArray(res.message)
            ? res.message[0]
            : res.message || 'Error';
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json({
      success: false,
      message,
      error_code,
      timestamp: new Date().toISOString(),
    });
  }
}
