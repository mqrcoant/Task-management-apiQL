import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TasksService } from './tasks.service';

/**
 * Modulo del dominio de tareas.
 * Registra la entidad `Task` en TypeORM y expone `TasksService` para que la
 * capa GraphQL (resolvers) pueda consumirlo.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
