import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { jwtConfiguration } from './authConfiguration';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConfiguration.secret,
      signOptions: jwtConfiguration.signOptions
    }),
    UsersModule, 
  ],
  providers: [AuthService, 
              LocalStrategy,
              JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
