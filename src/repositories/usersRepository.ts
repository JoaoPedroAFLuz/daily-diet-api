import { knex } from 'database';

class UsersRepository {
  async findById(id: string) {
    return knex('users').where({ id }).first();
  }
}

export const usersRepository = new UsersRepository();
