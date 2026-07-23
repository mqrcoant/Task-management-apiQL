import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { TaskStatus } from '../enums/task-status.enum';
import { CreateTaskInput } from './create-task.input';

/**
 * Datos de entrada para actualizar una tarea existente.
 * Hereda `title` y `description` de `CreateTaskInput` mediante `PartialType`,
 * por lo que ambos pasan a ser opcionales, y anade el `id` obligatorio junto
 * con el `status` opcional.
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
