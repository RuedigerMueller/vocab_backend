import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VocabulariesController } from './vocabularies.controller';
import { VocabulariesService } from './vocabularies.service';
import { Vocabulary } from './vocabulary.entity';
import { LessonsService } from '../lessons/lessons.service';
import { Lesson } from '../lessons/lesson.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vocabulary, Lesson])],
  controllers: [VocabulariesController],
  providers: [VocabulariesService, LessonsService],
})
export class VocabulariesModule {}
