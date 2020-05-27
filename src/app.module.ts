import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { VocabulariesModule } from './vocabulary/vocabulary.module';
import { LessonsModule } from './lessons/lessons.module';
import { ConfigurationService } from './configuration/configuration.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(), 
    VocabulariesModule, 
    LessonsModule
  ],
  providers: [ConfigurationService],
})

export class AppModule {
  constructor(private connection: Connection) {}
}
