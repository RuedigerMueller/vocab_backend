import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Lesson } from './lesson.entity';
import { LessonsService } from './lessons.service';

// @UseGuards(JwtAuthGuard)
@Controller('lessons')
export class LessonsController {
  constructor(private _lessonsService: LessonsService) {}

  @Get()
  async findAll(): Promise<Lesson[]> {
    return this._lessonsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Lesson> {
    return this._lessonsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this._lessonsService.remove(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() createLessonDto: CreateLessonDto) {
    this._lessonsService.create(createLessonDto);
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  update(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto) {
    return this._lessonsService.update(id, updateLessonDto);
  }
}
