import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { VocabulariesModule } from './vocabulary/vocabulary.module';
import { LessonsModule } from './lessons/lessons.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(), 
    VocabulariesModule, 
    LessonsModule
  ],
})

export class AppModule {
  constructor(private connection: Connection) {}
}
