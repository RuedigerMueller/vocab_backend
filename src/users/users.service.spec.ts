import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRepositoryMock } from './user.repository.mock';
import { addUser_1, addUser_2, user_1 } from './user.test.data';
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

    it('should not create a user when data is missing', async () => {
      const createUserDto: CreateUserDto = new CreateUserDto();
      createUserDto.username = addUser_2.username;
      createUserDto.email = addUser_2.email;
      createUserDto.firstName = addUser_2.firstName;
      createUserDto.lastName = addUser_2.lastName;
      createUserDto.password = addUser_2.password;

      createUserDto.username = '';
      await expect(service.create(createUserDto)).rejects.toThrow()
     
      createUserDto.username = addUser_2.username;
      createUserDto.email = '';
      await expect(service.create(createUserDto)).rejects.toThrow()

      createUserDto.email = addUser_2.email;
      createUserDto.firstName = '';
      await expect(service.create(createUserDto)).rejects.toThrow()

      createUserDto.firstName = addUser_2.firstName;
      createUserDto.lastName = '';
      await expect(service.create(createUserDto)).rejects.toThrow()

      createUserDto.lastName = addUser_2.lastName
      createUserDto.password = '';
      await expect(service.create(createUserDto)).rejects.toThrow()
    });

    it('should not create a user when e-mail is already taken', async () => {
      const createUserDto: CreateUserDto = new CreateUserDto();
      createUserDto.username = addUser_1.username;
      createUserDto.email = user_1.email;
      createUserDto.firstName = addUser_1.firstName;
      createUserDto.lastName = addUser_1.lastName;
      createUserDto.password = addUser_1.password;
      await expect(service.create(createUserDto)).rejects.toThrow()
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
