import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { User } from './users/user.entity';
import { UserRepositoryMock } from './users/user.repository.mock';
import { UsersService } from './users/users.service';
import { jwtConfiguration } from './auth/authConfiguration';
import { user_1 } from './users/user.test.data';

describe('App Controller', () => {
  let appController: AppController;

  const http = require('http');

  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      imports: [
        JwtModule.register({
          secret: jwtConfiguration.secret,
          signOptions: { expiresIn: '1800s' },
        }),
      ],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: UserRepositoryMock,
        },
        AuthService,
        AppService,
      ], 
    }).compile();

    appController = module.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  describe('login', () => {
    it('should login a validated user', async () => {
      const request = new http.IncomingMessage();
      request.user = user_1;

      const result: User = await appController.login(request);
      expect(result).toEqual(user_1);
    });
  })
});
