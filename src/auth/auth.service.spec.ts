import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { UserRepositoryMock } from '../users/user.repository.mock';
import { user_1 } from '../users/user.test.data';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule,
        JwtModule.register({
          secret: process.env.JWT_SECRET,
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
        LocalStrategy,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return a user without password for valid users', async () => {
      const result:any = await service.validateUser(user_1.email, user_1.password);
      expect(result['password']).toBeUndefined();
    });

    it('should return null in case user was not provided', async () => {
      expect(await service.validateUser('', user_1.password)).toBeNull();
    });

    it('should return null in case password was not provided', async () => {
      expect(await service.validateUser(user_1.email, '')).toBeNull();
    });

    it('should return null in case of invalid password', async () => {
      expect(await service.validateUser(user_1.email, 'invalid password')).toBeNull();
    });
  })
  describe('login', () => {
    xit('should return the access token', async() => {
      const result: User = await service.login(user_1);
      expect(result['access_token']).toBeDefined();
    });
  });
  
/*
async login(user: User): Promise<User>{
    const payload = { 
        id: user.id,
        username: user.username, 
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        sub: user.id };
    user.access_token = this.jwtService.sign(payload);
    return user; */
});
