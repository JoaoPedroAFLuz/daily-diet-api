import { FastifyInstance } from 'fastify';

import { mealsRepository } from 'modules/meals/repositories/MealsRepository';
import { deleteMealService } from 'modules/meals/services/delete-meal';
import { findAllMealsService } from 'modules/meals/services/find-all-meals';
import { findMealByIdService } from 'modules/meals/services/find-meal-by-id';
import { findMealMetricsService } from 'modules/meals/services/find-metrics';
import { updateMealService } from 'modules/meals/services/update-meal-service';
import { checkAuthentication } from '../middlewares/check-authentication';
import { mealInputSchema } from '../schemas/create-meal-schema';
import { getMealParamsSchema } from '../schemas/get-meal-schema';

export async function mealsRoutes(app: FastifyInstance) {
  app.post(
    '/',
    {
      preHandler: [checkAuthentication],
    },
    async (request, reply) => {
      const { id: userId } = request.user;

      const { name, description, dateTime, isInDiet } = mealInputSchema.parse(
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

      const meals = await findAllMealsService({ userId });

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

      const { id: mealId } = getMealParamsSchema.parse(request.params);

      const meal = await findMealByIdService({ mealId, userId });

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

      const mealMetrics = await findMealMetricsService({ userId });

      return reply.send({ mealMetrics });
    },
  );

  app.put(
    '/:id',
    {
      preHandler: [checkAuthentication],
    },
    async (request, reply) => {
      const { id: userId } = request.user;

      const { id: mealId } = getMealParamsSchema.parse(request.params);

      const { name, description, dateTime, isInDiet } = mealInputSchema.parse(
        request.body,
      );

      await updateMealService({
        mealId,
        userId,
        name,
        description,
        dateTime,
        isInDiet,
      });

      return reply.status(204).send();
    },
  );

  app.delete(
    '/:id',
    {
      preHandler: [checkAuthentication],
    },
    async (request, reply) => {
      const { id: userId } = request.user;

      const { id: mealId } = getMealParamsSchema.parse(request.params);

      await deleteMealService({ mealId, userId });

      return reply.status(204).send();
    },
  );
}
