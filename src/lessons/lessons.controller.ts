import {
  Controller,
  Get,
  Param,
  Delete,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
  Patch,
} from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { Lesson } from './lesson.entity';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

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
