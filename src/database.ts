import { Knex, knex as setupKnex } from 'knex';

const config: Knex.Config = {
  client: 'sqlite',
  connection: {
    filename: './src/database/app.db',
  },
  useNullAsDefault: true,
};

export const knex = setupKnex(config);
