import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRepositoryMock } from './user.repository.mock';
import { addUser_1, user_1 } from './user.test.data';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: UserRepositoryMock,
        }
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user with ID', async () => {
      const expected_result: User =addUser_1;

      const createUserDto: CreateUserDto = new CreateUserDto();
      createUserDto.username = addUser_1.username;
      createUserDto.email = addUser_1.email;
      createUserDto.firstName = addUser_1.firstName;
      createUserDto.lastName =  addUser_1.lastName;
      createUserDto.password = addUser_1.password;

      await service.create(createUserDto);

      expect(await service.findOne(addUser_1.email)).toEqual(expected_result);
    });
  });

  describe('findOne', () => {
    it('should find a user with an existing e-mail', async () => {
      expect(await service.findOne(user_1.email)).toEqual(user_1);
    });

    it('should not find a user with a not existing e-mail', async () => {
      expect(await service.findOne('invalid@email.com')).toBeUndefined();
    });
  });

  describe('findbyID', () => {
    it('should find a user with an existing ID', async () => {
      expect(await service.findbyID(user_1.id)).toEqual(user_1);
    });

    it('should not find a user with a not existing ID', async () => {
      expect(await service.findbyID(4711)).toBeUndefined();
    });
  });
});
