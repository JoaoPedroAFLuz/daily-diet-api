import { FastifyRequest } from 'fastify';
import { verify } from 'jsonwebtoken';

import { env } from 'env';
import { ApiError } from 'errors/api-error';
import { usersRepository } from 'repositories/usersRepository';

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

    const user = await usersRepository.findById(userId);

    if (!user) {
      throw new ApiError({ statusCode: 404, message: 'User not found' });
    }

    request.user = { id: user.id };
  } catch (error) {
    throw new ApiError({ statusCode: 401, message: 'Invalid token' });
  }
}
