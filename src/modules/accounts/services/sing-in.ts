import { hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { env } from 'process';

import auth from 'config/auth';
import { ApiError } from 'shared/errors/api-error';
import { usersRepository } from '../repositories/UsersRepository';

interface SignInParams {
  name: string;
  email: string;
  password: string;
}

export async function signInService({ name, email, password }: SignInParams) {
  const emailAlreadyInUse = await usersRepository.findByEmail({ email });

  if (emailAlreadyInUse) {
    throw new ApiError({ statusCode: 409, message: 'Email already in use' });
  }

  const hashedPassword = await hash(password, 12);

  const { id: userId } = await usersRepository.create({
    name,
    email,
    password: hashedPassword,
  });

  return generateAccessToken(userId);
}

function generateAccessToken(userId: string) {
  return sign({}, env.JWT_SECRET, {
    subject: userId,
    expiresIn: auth.expiresIn,
  });
}
