import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { jwtConstants } from './auth/constants';
import { User } from './users/user.entity';
import { UserRepositoryMock } from './users/user.repository.mock';
import { UsersService } from './users/users.service';

describe('App Controller', () => {
  let appController: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      //imports: [AuthModule, UsersModule],
      controllers: [AppController],
      imports: [
        JwtModule.register({
          secret: jwtConstants.secret,
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

  xit('should be unit tested', () => {
  });
});
