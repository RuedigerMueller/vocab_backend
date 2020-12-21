import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { user_1 } from "../users/user.test.data";
import { User } from '../users/user.entity';
import { UserRepositoryMock } from "../users/user.repository.mock";
import { UsersService } from "../users/users.service";
import { AuthService } from "./auth.service";
import { jwtConfiguration } from "./authConfiguration";
import { LocalStrategy } from "./local.strategy";

describe('Local Strategy', () => {
    let strategy: LocalStrategy;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                PassportModule,
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
                LocalStrategy,
            ],
        }).compile();

        strategy = module.get<LocalStrategy>(LocalStrategy);
    });

    it('should be defined', () => {
        expect(strategy).toBeDefined();
    });

    describe('validate', () => {
        it('should validate a valid user', async () => {
            const user: User = await strategy.validate(user_1.email, user_1.password);
            expect(user).toBeDefined;
        });

        it('should throw in case user was not provided', async () => {
            await expect(strategy.validate('', user_1.password)).rejects.toThrow()
        });

        it('should throw in case password was not provided', async () => {
            await expect(strategy.validate(user_1.email, '')).rejects.toThrow();
        });

        it('should throw in case of invalid password', async () => {
            await expect(strategy.validate(user_1.email, 'invalid password')).rejects.toThrow();
        });
    });
});