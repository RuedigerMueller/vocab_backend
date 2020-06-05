import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { AppConfigurationService } from './app-configuration/app-configuration.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { LessonsModule } from './lessons/lessons.module';
import { UsersModule } from './users/users.module';
import { VocabulariesModule } from './vocabulary/vocabulary.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(), 
    VocabulariesModule, 
    LessonsModule, AuthModule, UsersModule,
  ],
  providers: [AppConfigurationService, AppService],
  controllers: [AppController],
})

export class AppModule {
  constructor(private connection: Connection) {
  }
}
