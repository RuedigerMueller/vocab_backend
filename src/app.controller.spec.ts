import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { UserRepositoryMock } from './users/user.repository.mock';

describe('App Controller', () => {
  let appController: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, UsersModule],
      controllers: [AppController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: UserRepositoryMock,
        },
        AppService,
      ], 
    }).compile();

    appController = module.get<AppController>(AppController);
  });

  xit('should be defined', () => {
    expect(appController).toBeDefined();
  });
});
