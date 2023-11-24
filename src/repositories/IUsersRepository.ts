import { User } from 'models/Users';

export interface IUsersRepository {
  findById(id: string): Promise<User>;
}
