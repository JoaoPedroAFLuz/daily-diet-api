import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import auth from 'config/auth';
import { env } from 'config/env';
import { ApiError } from 'shared/errors/api-error';
import { usersRepository } from '../repositories/UsersRepository';

interface AuthenticateServiceParams {
  email: string;
  password: string;
}

export async function authenticateService({
  email,
  password,
}: AuthenticateServiceParams) {
  const user = await usersRepository.findByEmail({ email });

  if (!user) {
    throw new ApiError({ message: 'Credentials invalid' });
  }

  const passwordMatch = await compare(password, user.password);

  if (!passwordMatch) {
    throw new ApiError({ message: 'Credentials invalid' });
  }

  return generateAccessToken(user.id);
}

function generateAccessToken(userId: string) {
  return sign({}, env.JWT_SECRET, {
    subject: userId,
    expiresIn: auth.expiresIn,
  });
}
