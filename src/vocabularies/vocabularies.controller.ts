import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { VocabulariesService } from './vocabularies.service';
import { Vocabulary } from './vocabulary.entity';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto';

@Controller()
export class VocabulariesController {
  constructor(private _vocabulariesService: VocabulariesService) {}

  @Get('/vocabulary')
  async findAll(): Promise<Vocabulary[]> {
    return this._vocabulariesService.findAll();
  }

  @Get('/vocabulary/:id')
  async findOne(@Param('id') id: string): Promise<Vocabulary> {
    return this._vocabulariesService.findOne(id);
  }

  @Get('/lesson/:id/vocabulary')
  async getLessonVocabulary(@Param('id') id: string): Promise<Vocabulary[]> {
      return this._vocabulariesService.getLessonVocabulary(id);
  }

  @Delete('/vocabulary/:id')
  remove(@Param('id') id: string) {
    return this._vocabulariesService.remove(id);
  }

  @Post('/vocabulary')
  @UsePipes(ValidationPipe)
  async create(@Body() createVocabularyDto: CreateVocabularyDto) {
    await this._vocabulariesService.create(createVocabularyDto);
  }

  @Put('/vocabulary/vocabKnown/:id')
  vocabKnown(@Param('id') id: string) {
    return this._vocabulariesService.vocabKnown(id);
  }

  @Put('/vocabulary/vocabUnknown/:id')
  vocabUnknown(@Param('id') id: string) {
    return this._vocabulariesService.vocabUnknown(id);
  }

  @Put('/vocabulary/:id')
  @UsePipes(ValidationPipe)
  update(
    @Param('id') id: string,
    @Body() updateVocabularyDto: UpdateVocabularyDto,
  ) {
    return this._vocabulariesService.update(id, updateVocabularyDto);
  }
}
