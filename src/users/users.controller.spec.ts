import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRepositoryMock } from './user.repository.mock';
import { addUser, user_1 } from './user.test.data';
import { CreateUserDto } from './dto/create-user.dto';

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
      const expected_result: User =addUser;

      const createUserDto: CreateUserDto = new CreateUserDto();
      createUserDto.username = addUser.username;
      createUserDto.email = addUser.email;
      createUserDto.firstName = addUser.firstName;
      createUserDto.lastName =  addUser.lastName;
      createUserDto.password = addUser.password;

      await controller.create(createUserDto);

      expect(await controller.findOne(addUser.id.toString())).toEqual(expected_result);
    });

    it('should not create a user when data is missing', async () => {
      const createUserDto: CreateUserDto = new CreateUserDto();
      createUserDto.username = addUser.username;
      createUserDto.email = addUser.email;
      createUserDto.firstName = addUser.firstName;
      createUserDto.lastName =  addUser.lastName;
      createUserDto.password = addUser.password;

      createUserDto.username = '';
      expect(await controller.create(createUserDto)).toBeUndefined();

     createUserDto.username = addUser.username;
     createUserDto.email = '';
     expect(await controller.create(createUserDto)).toBeUndefined();

     createUserDto.email = addUser.email;
     createUserDto.firstName = '';
     expect(await controller.create(createUserDto)).toBeUndefined();

     createUserDto.firstName = addUser.firstName;
     createUserDto.lastName =  '';
     expect(await controller.create(createUserDto)).toBeUndefined();
     
     createUserDto.lastName = addUser.lastName
     createUserDto.password = '';
     expect(await controller.create(createUserDto)).toBeUndefined();
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
