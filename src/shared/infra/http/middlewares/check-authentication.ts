import { FastifyRequest } from 'fastify';
import { verify } from 'jsonwebtoken';

import { env } from 'config/env';
import { ApiError } from 'shared/errors/api-error';
import { usersRepository } from 'modules/accounts/repositories/UsersRepository';

export async function checkAuthentication(request: FastifyRequest) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new ApiError({
      statusCode: 401,
      message: 'Token not found',
    });
  }

  const [, accessToken] = authHeader.split(' ');

  try {
    const { sub: userId } = verify(accessToken, env.JWT_SECRET) as {
      sub: string;
    };

    const user = await usersRepository.findById({ userId });

    if (!user) {
      throw new ApiError({ statusCode: 404, message: 'User not found' });
    }

    request.user = { id: user.id };
  } catch (error) {
    throw new ApiError({ statusCode: 401, message: 'Invalid token' });
  }
}
