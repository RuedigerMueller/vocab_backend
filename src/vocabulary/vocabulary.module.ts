import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VocabularyService } from './vocabulary.service';
import { Vocabulary } from './vocabulary.entity';
import { LessonsService } from '../lessons/lessons.service';
import { Lesson } from '../lessons/lesson.entity';
import { VocabularyController } from './vocabulary.controller';
import { ConfigurationService } from 'src/configuration/configuration.service';

@Module({
  imports: [TypeOrmModule.forFeature([Vocabulary, Lesson])],
  controllers: [VocabularyController],
  providers: [VocabularyService, LessonsService, ConfigurationService], 
})
export class VocabulariesModule {}
