import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  private readonly _logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private _userRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User | undefined> {
    this._logger.log(`create: createUserDto = ${JSON.stringify(createUserDto)}`);

    // check if all required data was provided
    if (createUserDto.username === '' || createUserDto.password === '' || createUserDto.firstName === '' || createUserDto.lastName === '' || createUserDto.email === '') {
      this._logger.warn(`create: User data incomplete`);
      throw new Error(`Not all required attributes provided`);
    }

    // check if user with same e-Mail address does not already exist
    if ((await this.findOne(createUserDto.email) !== undefined)) {
      this._logger.warn(`create: User with e-Mail ${createUserDto.email} address already exists!`);
      throw new Error(`User with email already exists`);
    }
    
    const user: Partial<User> = createUserDto;

    return await this._userRepository.save(user);
  }

  async findOne(email: string): Promise<User | undefined> {
    this._logger.log(`findOne: email = ${email}`);
    return this._userRepository.findOne({ where: { email: email } });
  }

  async findbyID(id: number): Promise<User | undefined> {
    this._logger.log(`findbyID: id = ${id}`);
    return this._userRepository.findOne({ where: { id: id } });
  }
}
