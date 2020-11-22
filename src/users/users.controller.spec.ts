import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRepositoryMock } from './user.repository.mock';
import { addUser_1, addUser_2, user_1 } from './user.test.data';
import { CreateUserDto } from './dto/create-user.dto';
import { throws } from 'assert';

describe('Users Controller', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: UserRepositoryMock,
        }
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const expected_result: User = addUser_1;

      const createUserDto: CreateUserDto = new CreateUserDto();
      createUserDto.username = addUser_1.username;
      createUserDto.email = addUser_1.email;
      createUserDto.firstName = addUser_1.firstName;
      createUserDto.lastName = addUser_1.lastName;
      createUserDto.password = addUser_1.password;

      await controller.create(createUserDto);

      expect(await controller.findOne(addUser_1.id.toString())).toEqual(expected_result);
    });

    it('should not create a user when data is missing', async () => {
      const createUserDto: CreateUserDto = new CreateUserDto();
      createUserDto.username = addUser_2.username;
      createUserDto.email = addUser_2.email;
      createUserDto.firstName = addUser_2.firstName;
      createUserDto.lastName = addUser_2.lastName;
      createUserDto.password = addUser_2.password;

      createUserDto.username = '';
      await expect(controller.create(createUserDto)).rejects.toThrow()
     
      createUserDto.username = addUser_2.username;
      createUserDto.email = '';
      await expect(controller.create(createUserDto)).rejects.toThrow()

      createUserDto.email = addUser_2.email;
      createUserDto.firstName = '';
      await expect(controller.create(createUserDto)).rejects.toThrow()

      createUserDto.firstName = addUser_2.firstName;
      createUserDto.lastName = '';
      await expect(controller.create(createUserDto)).rejects.toThrow()

      createUserDto.lastName = addUser_2.lastName
      createUserDto.password = '';
      await expect(controller.create(createUserDto)).rejects.toThrow()
    });
  });

  describe('findOne', () => {
    it('should find a user with an existing e-mail', async () => {
      expect(await controller.findOne(user_1.id.toString())).toEqual(user_1);
    });

    it('should not find a user with a not existing e-mail', async () => {
      expect(await controller.findOne('4711')).toBeUndefined();
    });
  });
});
