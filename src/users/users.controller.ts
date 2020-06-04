import { Controller, UsePipes, Post, ValidationPipe, Body, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
    constructor(private _usersService: UsersService) { }

    @Post()
    @UsePipes(ValidationPipe)
    async create(@Body() createUser: CreateUserDto) {
        this._usersService.create(createUser);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<User> {
        return this._usersService.findbyID(parseInt(id));
    }
}
