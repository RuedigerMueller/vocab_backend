import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private readonly _logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private _userRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    this._logger.log(`create: createUserDto = ${ JSON.stringify(createUserDto) }`);
    const user: User = new User();

    if (createUserDto.username === '' || createUserDto.password === ''  || createUserDto.firstName === '' || createUserDto.lastName === '' || createUserDto.email === '') return;

    user.username = createUserDto.username;
    user.password = createUserDto.password;
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName; 
    user.email =createUserDto.email;

    return await this._userRepository.save(user);
  }

  async findOne(email: string): Promise<User | undefined> {
    this._logger.log(`findOne: email = ${ email }`);
    return this._userRepository.findOne({ where: { email: email } });
  }

  async findbyID(id: number): Promise<User | undefined> {
    this._logger.log(`findbyID: id = ${ id }`);
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