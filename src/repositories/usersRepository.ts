import { knex } from 'database';

import { IUsersRepository } from './IUsersRepository';

class UsersRepository implements IUsersRepository {
  async findById(id: string) {
    return knex('users').where({ id }).first();
  }
}

export const usersRepository = new UsersRepository();
