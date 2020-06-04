import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { VocabulariesModule } from './vocabulary/vocabulary.module';
import { LessonsModule } from './lessons/lessons.module';
import { ConfigModule } from '@nestjs/config';
import { AppConfigurationService } from './app-configuration/app-configuration.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(), 
    VocabulariesModule, 
    LessonsModule, AuthModule, UsersModule,
  ],
  providers: [AppConfigurationService, AppService],
  controllers: [AppController],
})

export class AppModule {
  constructor(private connection: Connection) {
    console.log(process.env)
  }
}
