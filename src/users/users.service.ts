import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
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
    
    const user: User = new User();

    user.username = createUserDto.username;
    user.password = createUserDto.password;
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.email = createUserDto.email;

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

  async remove(email: string): Promise<void> {
    this._logger.log(`remove: email = ${email}`);
    const user: User = await this.findOne(email);
    await this._userRepository.remove(user);
  }
}
