import { Injectable } from '@nestjs/common';
import { User } from './user.entity';


@Injectable()
export class UsersService {
    // Todo: Replace with DB and hashed PW
    private readonly users: User[];
  
    constructor() {
      this.users = [
        {
          id: 1,
          username: 'john',
          password: 'changeme',
          firstName: 'John',
          lastName: 'Miller',
          email: 'john@example.com',
        },
        {
          id: 2,
          username: 'chris',
          password: 'secret',
          firstName: 'Chris',
          lastName: 'Myres',
          email: 'chris@example.com',
        },
        {
          id: 3,
          username: 'maria',
          password: 'guess',
          firstName: 'Maria',
          lastName: 'Muller',
          email: 'maria@example.com',
        },
      ];
    }
  
    async findOne(email: string): Promise<User | undefined> {
      return this.users.find(user => user.email === email);
    }
  }
