import { randomUUID } from 'crypto';
import { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { knex } from 'database';
import { ApiError } from 'errors/api-error';
import { MealMapper } from 'mappers/meal-mapper';
import { checkAuthentication } from 'middlewares/check-authentication';
import { Meal } from 'models/Meal';
import { MealMetricsDTO } from 'dtos/meal.dto';

export async function mealsRoutes(app: FastifyInstance) {
  app.post(
    '/',
    {
      preHandler: [checkAuthentication],
    },
    async (request, reply) => {
      const { id: user_id } = request.user;

      const createTransactionBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        dateTime: z.string(),
        isInDiet: z.boolean(),
      });

      const { name, description, dateTime, isInDiet } =
        createTransactionBodySchema.parse(request.body);

      let sessionId = request.cookies.sessionId;

      if (!sessionId) {
        sessionId = randomUUID();

        reply.cookie('sessionId', sessionId, {
          path: '/',
          maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        });
      }

      await knex('meals').insert({
        id: randomUUID(),
        user_id,
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
      const { id: user_id } = request.user;

      const meals = await knex<Meal>('meals').where({ user_id }).select('*');

      const mealsDto = meals.map(MealMapper.toDTO);

      return reply.send({ meals: mealsDto });
    },
  );

  app.get(
    '/:id',
    {
      preHandler: [checkAuthentication],
    },
    async (request, reply) => {
      const { id: user_id } = request.user;

      const getMealParamsSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = getMealParamsSchema.parse(request.params);

      const meal = await knex<Meal>('meals').where({ id, user_id }).first();

      if (!meal) {
        throw new ApiError({ statusCode: 404, message: 'Meal not found' });
      }

      const mealDto = MealMapper.toDTO(meal);

      return reply.send({ meal: mealDto });
    },
  );

  app.get(
    '/metrics',
    {
      preHandler: [checkAuthentication],
    },
    async (request, reply) => {
      const { id: user_id } = request.user;

      const meals = await knex<Meal>('meals').where({ user_id }).select('*');

      const mealsOnDiet = meals.filter((meals) => !!meals.isInDiet);
      const mealsOffDiet = meals.filter((meals) => !meals.isInDiet);

      const bestSequence = calculateConsecutiveMeals(meals);

      const mealMetrics: MealMetricsDTO = {
        totalMeals: meals.length,
        totalMealsOnDiet: mealsOnDiet.length,
        totalMealsOffDiet: mealsOffDiet.length,
        bestSequence,
      };

      return reply.send({ mealMetrics });
    },
  );

  function calculateConsecutiveMeals(meals: Meal[]) {
    let currentCount = 0;
    let maxCount = 0;

    for (const meal of meals) {
      if (meal.isInDiet) {
        currentCount++;
        maxCount = Math.max(maxCount, currentCount);
      } else {
        currentCount = 0;
      }
    }

    return maxCount;
  }
}
