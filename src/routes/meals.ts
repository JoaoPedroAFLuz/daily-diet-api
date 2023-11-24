import { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { MealMetricsDTO, createMealSchema } from 'dtos/meal.dto';
import { ApiError } from 'errors/api-error';
import { MealMapper } from 'mappers/meal-mapper';
import { checkAuthentication } from 'middlewares/check-authentication';
import { Meal } from 'models/Meal';
import { mealsRepository } from 'repositories/MealsRepository';

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

      const meals = await mealsRepository.findAll(userId);

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
      const { id: userId } = request.user;

      const getMealParamsSchema = z.object({
        id: z.string().uuid(),
      });

      const { id: mealId } = getMealParamsSchema.parse(request.params);

      const meal = await mealsRepository.findById(mealId, userId);

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
      const { id: userId } = request.user;

      const meals = await mealsRepository.findAll(userId);

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
