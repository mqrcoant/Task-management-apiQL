import { Field, InputType } from '@nestjs/graphql';
import {
  ArrayMaxSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

/**
 * Datos de entrada necesarios para crear una nueva tarea.
 * El estado inicial no se recibe: lo asigna la entidad `Task` con el valor
 * por defecto `TaskStatus.BACKLOG`.
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

  /**
   * Etiquetas de la tarea. Si se omite, la tarea se crea sin etiquetas.
   */
  @Field(() => [String], {
    nullable: true,
    description: 'Etiquetas de la tarea. Si se omite, se crea sin etiquetas.',
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  tags?: string[];

  /** Usuario responsable de la tarea. */
  @Field({ description: 'Usuario asignado como responsable de la tarea.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  assignedUser: string;

  /** Proyecto al que pertenece la tarea. */
  @Field({ description: 'Proyecto al que pertenece la tarea.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  project: string;
}
