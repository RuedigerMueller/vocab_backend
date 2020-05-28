import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { VocabulariesModule } from './vocabulary/vocabulary.module';
import { LessonsModule } from './lessons/lessons.module';
import { ConfigurationService } from './configuration/configuration.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(), 
    VocabulariesModule, 
    LessonsModule, AuthModule, UsersModule
  ],
  providers: [ConfigurationService, AppService],
  controllers: [AppController],
})

export class AppModule {
  constructor(private connection: Connection) {}
}
