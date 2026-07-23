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
 * Entidad de dominio que representa una tarea del sistema.
 * Cumple un doble rol: es la tabla `task` gestionada por TypeORM y, al mismo
 * tiempo, el tipo `Task` expuesto en el esquema GraphQL.
 */
@Entity('task')
@ObjectType({ description: 'Tarea gestionada por el sistema.' })
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

  /** Estado actual de la tarea. Por defecto `PENDING`. */
  @Column({
    type: 'simple-enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  @Field(() => TaskStatus, { description: 'Estado actual de la tarea.' })
  status: TaskStatus;

  /** Fecha de creacion, asignada automaticamente por TypeORM. */
  @CreateDateColumn()
  @Field({ description: 'Fecha de creacion del registro.' })
  createdAt: Date;

  /** Fecha de la ultima modificacion, actualizada automaticamente. */
  @UpdateDateColumn()
  @Field({ description: 'Fecha de la ultima actualizacion del registro.' })
  updatedAt: Date;
}
