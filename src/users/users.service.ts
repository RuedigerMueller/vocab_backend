import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private _userRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
     const user: User = new User();

    user.username = createUserDto.username;
    user.password = createUserDto.password;
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName; 
    user.email =createUserDto.email;

    return await this._userRepository.save(user);
  }

  async findOne(email: string): Promise<User | undefined> {
    return this._userRepository.findOne({ where: { email: email } });
  }

  async findbyID(id: number): Promise<User | undefined> {
    return this._userRepository.findOne({ where: { id: id } });
  }
}

/*
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
*/