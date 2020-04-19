import { Module } from '@nestjs/common';
import { Lesson } from './lesson.entity';
import { LessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Lesson])],
  controllers: [LessonsController],
  providers: [LessonsService],
})
export class LessonsModule {}
