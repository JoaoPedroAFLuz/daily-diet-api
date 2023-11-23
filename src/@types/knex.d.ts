// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Knex } from 'knex';

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string;
      name: string;
      email: string;
      password: string;
      created_at: string;
    };

    meals: {
      id: string;
      name: string;
      description: string;
      dateTime: string;
      isInDiet: boolean;
      created_ad: string;
      session_id: string;
    };
  }
}
