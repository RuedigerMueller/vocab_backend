import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Lesson } from './lesson.entity';
import { LessonsService } from './lessons.service';
import { User } from '../users/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('lessons')
export class LessonsController {
  constructor(private _lessonsService: LessonsService) {}

  @Get()
  async findAll(@Request() request: Request): Promise<Lesson[]> { 
    console.log(request);
    const user: User = request['user'];
    return this._lessonsService.findAll(user);
  }

  @Get(':id')
  async findOne(@Request() request: Request, @Param('id') id: string): Promise<Lesson> {
    const user: User = request['user'];
    return this._lessonsService.findOne(id, user);
  }

  @Delete(':id')
  remove(@Request() request: Request, @Param('id') id: string): Promise<void> {
    const user: User = request['user'];
    return this._lessonsService.remove(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Request() request: Request, @Body() createLessonDto: CreateLessonDto) {
    const user: User = request['user'];
    this._lessonsService.create(createLessonDto, user);
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  update(@Request() request: Request, @Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto) {
    const user: User = request['user'];
    return this._lessonsService.update(id, updateLessonDto, user);
  }
}
