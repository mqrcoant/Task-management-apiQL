import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TasksResolver } from './tasks.resolver';
import { TasksService } from './tasks.service';

/**
 * Modulo del dominio de tareas.
 * Registra la entidad `Task` en TypeORM y expone `TasksService` y
 * `TasksResolver`, conectando la capa GraphQL con la logica de negocio.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  providers: [TasksService, TasksResolver],
  exports: [TasksService],
})
export class TasksModule {}
