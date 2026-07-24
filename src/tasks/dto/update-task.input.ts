import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { TaskStatus } from '../enums/task-status.enum';
import { CreateTaskInput } from './create-task.input';

/**
 * Datos de entrada para actualizar una tarea existente.
 * Hereda `title`, `description`, `tags`, `assignedUser` y `project` de
 * `CreateTaskInput` mediante `PartialType`, por lo que todos pasan a ser
 * opcionales, y anade el `id` obligatorio junto con el `status` opcional.
 * Esto permite cambiar el estado, las etiquetas y el usuario responsable de
 * una tarea de forma independiente.
 */
@InputType({ description: 'Datos requeridos para actualizar una tarea.' })
export class UpdateTaskInput extends PartialType(CreateTaskInput) {
  /** Identificador (UUID) de la tarea a actualizar. */
  @Field(() => ID, { description: 'Identificador de la tarea a actualizar.' })
  @IsUUID()
  id: string;

  /** Nuevo estado de la tarea. Si se omite, el estado actual se conserva. */
  @Field(() => TaskStatus, {
    nullable: true,
    description: 'Nuevo estado de la tarea.',
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
