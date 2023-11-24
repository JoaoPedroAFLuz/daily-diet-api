import { FastifyError, FastifyInstance, FastifyReply } from 'fastify';
import { ZodError } from 'zod';

import { ApiError } from 'shared/errors/api-error';

export function errorHandler(app: FastifyInstance) {
  app.setErrorHandler((error: FastifyError, _, reply: FastifyReply) => {
    if (error instanceof ApiError) {
      return reply.status(error.statusCode).send({
        message: error.message,
      });
    }

    if (error instanceof ZodError) {
      return reply.status(error.statusCode || 400).send({
        message: error.format(),
      });
    }

    console.error(`Code: ${error.code}`);
    console.error(`Name: ${error.name}`);
    console.error(`Message: ${error.message}`);

    return reply.status(500).send({ message: 'Internal Server Error' });
  });
}
