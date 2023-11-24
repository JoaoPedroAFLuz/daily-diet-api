import { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { mealsRepository } from 'modules/meals/repositories/MealsRepository';
import { findAllMeals } from 'modules/meals/services/find-all-meals';
import { findMealById } from 'modules/meals/services/find-meal-by-id';
import { findMealMetrics } from 'modules/meals/services/find-metrics';
import { checkAuthentication } from '../middlewares/check-authentication';
import { createMealSchema } from '../schemas/create-meal-schema';

export async function mealsRoutes(app: FastifyInstance) {
  app.post(
    '/',
    {
      preHandler: [checkAuthentication],
    },
    async (request, reply) => {
      const { id: userId } = request.user;

      const { name, description, dateTime, isInDiet } = createMealSchema.parse(
        request.body,
      );

      await mealsRepository.create({
        userId,
        name,
        description,
        dateTime,
        isInDiet,
      });

      return reply.status(201).send();
    },
  );

  app.get(
    '/',
    {
      preHandler: [checkAuthentication],
    },
    async (request, reply) => {
      const { id: userId } = request.user;

      const meals = await findAllMeals({ userId });

      return reply.send({ meals });
    },
  );

  app.get(
    '/:id',
    {
      preHandler: [checkAuthentication],
    },
    async (request, reply) => {
      const { id: userId } = request.user;

      const getMealParamsSchema = z.object({
        id: z.string().uuid(),
      });

      const { id: mealId } = getMealParamsSchema.parse(request.params);

      const meal = await findMealById({ mealId, userId });

      return reply.send({ meal });
    },
  );

  app.get(
    '/metrics',
    {
      preHandler: [checkAuthentication],
    },
    async (request, reply) => {
      const { id: userId } = request.user;

      const mealMetrics = await findMealMetrics({ userId });

      return reply.send({ mealMetrics });
    },
  );
}
