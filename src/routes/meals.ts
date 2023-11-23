import { randomUUID } from 'crypto';
import { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { knex } from '../database';
import { Meals } from '../models/Meals';
import { checkSessionId } from '../middlewares/check-session-id';

export async function mealsRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
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
      name,
      description,
      dateTime,
      isInDiet,
      session_id: sessionId,
    });

    return reply.status(201).send();
  });

  app.get(
    '/',
    {
      preHandler: [checkSessionId],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies;

      const meals = await knex('meals')
        .where({ session_id: sessionId })
        .select('*');

      return reply.send({ meals });
    },
  );

  app.get(
    '/:id',
    {
      preHandler: [checkSessionId],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies;

      const getMealParamsSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = getMealParamsSchema.parse(request.params);

      const meal = await knex('meals')
        .where({ id, session_id: sessionId })
        .first();

      if (!meal) {
        return reply.status(404).send();
      }

      return { meal };
    },
  );

  app.get(
    '/metrics',
    {
      preHandler: [checkSessionId],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies;

      const meals: Meals[] = await knex('meals')
        .where({ session_id: sessionId })
        .select('*');

      const mealsOnDiet = meals.filter((meals) => !!meals.isInDiet);
      const mealsOffDiet = meals.filter((meals) => !meals.isInDiet);

      const bestSequence = calculateConsecutiveMeals(meals);

      const metrics = {
        total: meals.length,
        totalMealsOnDiet: mealsOnDiet.length,
        totalMealsOffDiet: mealsOffDiet.length,
        bestSequence,
      };

      return reply.send({ metrics });
    },
  );

  function calculateConsecutiveMeals(meals: Meals[]) {
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
