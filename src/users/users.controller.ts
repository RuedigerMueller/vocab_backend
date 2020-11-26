import { Controller, UsePipes, Post, ValidationPipe, Body, Get, Param, HttpStatus, HttpException, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor(private _usersService: UsersService) { }

    @Post()
    @UsePipes(ValidationPipe)
    async create(@Body() createUser: CreateUserDto): Promise<User | undefined> {
        try {
            const user: User = await this._usersService.create(createUser)
            return user;
       } catch (e) {
            throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
       }
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async findOne(@Param('id') id: string): Promise<User | undefined> {
        return this._usersService.findbyID(parseInt(id));
    }

    @Get()
    async findByEmail(@Query('email') email: string): Promise<User | undefined> {
        return this._usersService.findOne(email);
    }
}
