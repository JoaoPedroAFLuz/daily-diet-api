import { FastifyInstance } from 'fastify';

import { authRoutes } from './auth';
import { mealsRoutes } from './meals';

export async function routes(app: FastifyInstance) {
  app.register(authRoutes, {
    prefix: '/auth',
  });

  app.register(mealsRoutes, {
    prefix: '/meals',
  });
}
