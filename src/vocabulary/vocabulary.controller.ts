import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards, UsePipes, ValidationPipe, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto';
import { Vocabulary } from './vocabulary.entity';
import { VocabularyService } from './vocabulary.service';
import { User } from 'src/users/user.entity';

@UseGuards(JwtAuthGuard)
@Controller()
export class VocabularyController {
  constructor(private _vocabulariesService: VocabularyService) { }

  @Get('/vocabulary')
  async findAll(@Request() request: Request): Promise<Vocabulary[]> {
    const user: User = request['user'];
    return this._vocabulariesService.findAll(user);
  }

  @Get('/vocabulary/:id')
  async findOne(@Request() request: Request, @Param('id') id: string): Promise<Vocabulary> {
    const user: User = request['user'];
    return this._vocabulariesService.findOne(id, user);
  }

  @Get('/lessons/:id/vocabulary')
  async getLessonVocabulary(@Request() request: Request, @Param('id') id: string): Promise<Vocabulary[]> {
    const user: User = request['user'];
    return this._vocabulariesService.getLessonVocabulary(id, user);
  }

  @Get('/lessons/:id/dueLessonVocabulary')
  async getDueLessonVocabulary(@Request() request: Request, @Param('id') id: string): Promise<Vocabulary[]> {
    const user: User = request['user'];
    return this._vocabulariesService.getDueLessonVocabulary(id, user);
  }

  @Delete('/vocabulary/:id')
  remove(@Request() request: Request, @Param('id') id: string) {
    const user: User = request['user'];
    return this._vocabulariesService.remove(id, user);
  }

  @Post('/vocabulary')
  @UsePipes(ValidationPipe)
  async create(@Request() request: Request, @Body() createVocabularyDto: CreateVocabularyDto) {
    const user: User = request['user'];
    await this._vocabulariesService.create(createVocabularyDto, user);
  }

  @Put('/vocabulary/vocabKnown/:id')
  vocabKnown(@Request() request: Request, @Param('id') id: string) {
    const user: User = request['user'];
    return this._vocabulariesService.vocabKnown(id, user);
  }

  @Put('/vocabulary/vocabUnknown/:id')
  vocabUnknown(@Request() request: Request, @Param('id') id: string) {
    const user: User = request['user'];
    return this._vocabulariesService.vocabUnknown(id, user);
  }

  @Patch('/vocabulary/:id')
  @UsePipes(ValidationPipe)
  update(
    @Request() request: Request,
    @Param('id') id: string,
    @Body() updateVocabularyDto: UpdateVocabularyDto,
  ) {
    const user: User = request['user'];
    return this._vocabulariesService.update(id, updateVocabularyDto, user);
  }
}
