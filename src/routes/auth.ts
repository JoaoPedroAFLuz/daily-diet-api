import { compare, hash } from 'bcryptjs';
import { FastifyInstance } from 'fastify';
import { sign } from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';

import auth from 'config/auth';
import { knex } from 'database';
import { env } from 'env';
import { ApiError } from 'errors/api-error';

export async function authRoutes(app: FastifyInstance) {
  app.post('/sign-up', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string().min(3, 'Must provide full name'),
      email: z.string().email('Invalid e-mail'),
      password: z
        .string()
        .min(8, 'Password must be at least 8 characters long'),
    });

    const { name, email, password } = createUserBodySchema.parse(request.body);

    const emailAlreadyInUse = await knex('users').where({ email }).first();

    if (emailAlreadyInUse) {
      throw new ApiError({ statusCode: 409, message: 'Email already in use' });
    }

    const hashedPassword = await hash(password, 12);

    const [user] = await knex('users')
      .insert({
        id: randomUUID(),
        name,
        email,
        password: hashedPassword,
      })
      .returning('*');

    const accessToken = generateAccessToken(user.id);

    return reply.status(201).send({ accessToken });
  });

  app.post('/log-in', async (request, reply) => {
    const authenticateUserBodySchema = z.object({
      email: z.string().email('Invalid e-mail'),
      password: z
        .string()
        .min(8, 'Password must be at least 8 characters long'),
    });

    const { email, password } = authenticateUserBodySchema.parse(request.body);

    const user = await knex('users').where({ email }).first();

    if (!user) {
      throw new ApiError({ message: 'Credentials invalid' });
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new ApiError({ message: 'Credentials invalid' });
    }

    const accessToken = generateAccessToken(user.id);

    return reply.status(200).send({
      accessToken,
    });
  });

  function generateAccessToken(userId: string) {
    return sign({}, env.JWT_SECRET, {
      subject: userId,
      expiresIn: auth.expiresIn,
    });
  }
}
