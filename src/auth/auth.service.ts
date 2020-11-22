import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    private readonly _logger = new Logger(AuthService.name);
    constructor(private usersService: UsersService, private jwtService: JwtService) { }

    async validateUser(username: string, pass: string): Promise<any> {
        this._logger.log(`validateUser: username = ${ username }, password = ${ pass !== '' }`);
        const user: User = await this.usersService.findOne(username);
        if (user && user.password === pass) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: User): Promise<User>{
        this._logger.log(`login: user = ${ JSON.stringify(user) }`);
        const payload = { 
            id: user.id,
            username: user.username, 
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            sub: user.id };
        user.access_token = this.jwtService.sign(payload);
        return user;
    }
}
