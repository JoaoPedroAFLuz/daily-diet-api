import { knex } from 'shared/infra/knex/database';
import { randomUUID } from 'node:crypto';

import { IUsersRepository } from './IUsersRepository';
import { CreateUserDTO } from '../dtos/create-user-dto';

class UsersRepository implements IUsersRepository {
  async create({ name, email, password }: CreateUserDTO) {
    const [user] = await knex('users')
      .insert({
        id: randomUUID(),
        name,
        email,
        password,
      })
      .returning('*');

    return user;
  }

  async findById({ id }: { id: string }) {
    return knex('users').where({ id }).first();
  }

  async findByEmail({ email }: { email: string }) {
    return knex('users').where({ email }).first();
  }
}

export const usersRepository = new UsersRepository();
