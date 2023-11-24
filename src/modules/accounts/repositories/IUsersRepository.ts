import { User } from 'modules/accounts/models/Users';
import { CreateUserDTO } from '../dtos/create-user-dto';

export interface IUsersRepository {
  create(data: CreateUserDTO): Promise<User>;
  findById({ id }: { id: string }): Promise<User>;
  findByEmail({ email }: { email: string }): Promise<User>;
}
