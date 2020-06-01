import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigurationService } from '../configuration/configuration.service';
import { Lesson } from '../lessons/lesson.entity';
import { LessonsService } from '../lessons/lessons.service';
import { VocabularyController } from './vocabulary.controller';
import { Vocabulary } from './vocabulary.entity';
import { VocabularyService } from './vocabulary.service';


@Module({
  imports: [TypeOrmModule.forFeature([Vocabulary, Lesson])],
  controllers: [VocabularyController],
  providers: [VocabularyService, LessonsService, ConfigurationService], 
})
export class VocabulariesModule {}
