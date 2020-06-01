import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VocabularyService } from './vocabulary.service';
import { Vocabulary } from './vocabulary.entity';
import { LessonsService } from '../lessons/lessons.service';
import { Lesson } from '../lessons/lesson.entity';
import { VocabularyController } from './vocabulary.controller';
import { ConfigurationService } from '../configuration/configuration.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vocabulary, Lesson])],
  controllers: [VocabularyController],
  providers: [VocabularyService, LessonsService, ConfigurationService], 
})
export class VocabulariesModule {}
