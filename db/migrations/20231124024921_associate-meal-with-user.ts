import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('meals', (table) => {
    table.dropColumn('session_id');
  });

  await knex.schema.table('meals', (table) => {
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('meals', (table) => {
    table.integer('session_id').unsigned();
  });

  await knex.schema.table('meals', (table) => {
    table.dropColumn('user_id');
  });
}
