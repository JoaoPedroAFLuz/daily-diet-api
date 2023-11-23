// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Knex } from 'knex';

declare module 'knex/types/tables' {
  export interface Tables {
    meals: {
      id: string;
      name: string;
      description: string;
      dateTime: string;
      isDiet: boolean;
      created_ad: string;
    };
  }
}