import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { Request, Response } from 'express';

// Services let Prisma errors bubble up; without this filter every missing
// row, dangling foreign key, duplicate unique value, or malformed payload
// surfaced as a bare 500. Map them to the HTTP semantics clients expect:
// missing row on read/update/delete -> 404, bad reference or duplicate on a
// write -> 400, malformed Prisma input -> 400.
@Catch(Prisma.PrismaClientKnownRequestError, Prisma.PrismaClientValidationError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(
    exception:
      Prisma.PrismaClientKnownRequestError | Prisma.PrismaClientValidationError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let httpError: BadRequestException | NotFoundException;
    if (exception instanceof Prisma.PrismaClientValidationError) {
      httpError = new BadRequestException('Invalid request payload');
    } else if (exception.code === 'P2025') {
      httpError =
        request.method === 'POST'
          ? new BadRequestException('Referenced record does not exist')
          : new NotFoundException('Record not found');
    } else if (exception.code === 'P2002') {
      httpError = new BadRequestException(
        'A record with the same unique value already exists',
      );
    } else if (exception.code === 'P2003') {
      httpError = new BadRequestException('Referenced record does not exist');
    } else {
      response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ statusCode: 500, message: 'Internal server error' });
      return;
    }
    response.status(httpError.getStatus()).json(httpError.getResponse());
  }
}
