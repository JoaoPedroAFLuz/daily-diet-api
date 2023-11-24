import { FastifyError, FastifyInstance, FastifyReply } from 'fastify';
import { ZodError } from 'zod';

export function errorHandler(app: FastifyInstance) {
  app.setErrorHandler((error: FastifyError, _, reply: FastifyReply) => {
    if (error instanceof ZodError) {
      return reply.status(error.statusCode || 400).send({
        message: error.format(),
      });
    }

    return reply.status(500).send({ message: 'Internal Server Error' });
  });
}
