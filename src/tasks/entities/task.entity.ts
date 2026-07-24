import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TaskStatus } from '../enums/task-status.enum';

/**
 * Entidad de dominio que representa una tarea de un proyecto de desarrollo
 * de software.
 * Cumple un doble rol: es la tabla `task` gestionada por TypeORM y, al mismo
 * tiempo, el tipo `Task` expuesto en el esquema GraphQL.
 */
@Entity('task')
@ObjectType({ description: 'Tarea de un proyecto de desarrollo de software.' })
export class Task {
  /** Identificador unico (UUID) generado automaticamente al persistir. */
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, { description: 'Identificador unico de la tarea.' })
  id: string;

  /** Titulo descriptivo y obligatorio de la tarea. */
  @Column()
  @Field({ description: 'Titulo de la tarea.' })
  title: string;

  /** Detalle opcional que amplia el titulo. */
  @Column({ nullable: true })
  @Field({ nullable: true, description: 'Descripcion detallada de la tarea.' })
  description?: string;

  /** Estado actual de la tarea dentro del tablero. Por defecto `BACKLOG`. */
  @Column({
    type: 'simple-enum',
    enum: TaskStatus,
    default: TaskStatus.BACKLOG,
  })
  @Field(() => TaskStatus, { description: 'Estado actual de la tarea.' })
  status: TaskStatus;

  /**
   * Etiquetas libres asociadas a la tarea (por ejemplo `backend`, `bug`).
   * Se persiste como `simple-array`, que serializa el arreglo en una unica
   * columna de texto separada por comas.
   */
  @Column({ type: 'simple-array', default: '' })
  @Field(() => [String], { description: 'Etiquetas asociadas a la tarea.' })
  tags: string[];

  /** Usuario responsable de ejecutar la tarea. */
  @Column()
  @Field({ description: 'Usuario asignado como responsable de la tarea.' })
  assignedUser: string;

  /** Proyecto de desarrollo al que pertenece la tarea. */
  @Column()
  @Field({ description: 'Proyecto al que pertenece la tarea.' })
  project: string;

  /** Fecha de creacion, asignada automaticamente por TypeORM. */
  @CreateDateColumn()
  @Field({ description: 'Fecha de creacion del registro.' })
  createdAt: Date;

  /** Fecha de la ultima modificacion, actualizada automaticamente. */
  @UpdateDateColumn()
  @Field({ description: 'Fecha de la ultima actualizacion del registro.' })
  updatedAt: Date;
}
