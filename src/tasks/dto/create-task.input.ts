import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * Datos de entrada necesarios para crear una nueva tarea.
 * El estado inicial no se recibe: lo asigna la entidad `Task` con el valor
 * por defecto `TaskStatus.PENDING`.
 */
@InputType({ description: 'Datos requeridos para crear una tarea.' })
export class CreateTaskInput {
  /** Titulo obligatorio de la tarea. */
  @Field({ description: 'Titulo de la tarea. No puede estar vacio.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  /** Descripcion opcional de la tarea. */
  @Field({ nullable: true, description: 'Descripcion opcional de la tarea.' })
  @IsOptional()
  @IsString()
  description?: string;
}
