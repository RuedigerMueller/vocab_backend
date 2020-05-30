import { Injectable } from '@nestjs/common';

export type User = any;

@Injectable()
export class UsersService {
    // Todo: Replace with DB and hashed PW
    private readonly users: User[];
  
    constructor() {
      this.users = [
        {
          userId: 1,
          username: 'john',
          password: 'changeme',
          email: 'john@example.com',
        },
        {
          userId: 2,
          username: 'chris',
          password: 'secret',
          email: 'chris@example.com',
        },
        {
          userId: 3,
          username: 'maria',
          password: 'guess',
          email: 'maria@example.com',
        },
      ];
    }
  
    async findOne(email: string): Promise<User | undefined> {
      return this.users.find(user => user.email === email);
    }
  }
