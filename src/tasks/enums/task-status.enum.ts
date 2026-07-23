import { registerEnumType } from '@nestjs/graphql';

/**
 * Estados posibles del ciclo de vida de una tarea.
 * Se utiliza tanto en la capa de persistencia (columna `status` de la entidad
 * `Task`) como en la capa de exposicion GraphQL, donde queda registrado como
 * un `enum` del esquema.
 */
export enum TaskStatus {
  /** La tarea fue creada pero aun no se ha comenzado a trabajar en ella. */
  PENDING = 'PENDING',
  /** La tarea esta actualmente en ejecucion. */
  IN_PROGRESS = 'IN_PROGRESS',
  /** La tarea fue finalizada. */
  COMPLETED = 'COMPLETED',
}

/**
 * Registra `TaskStatus` en el esquema GraphQL (enfoque Code-First) para que
 * pueda ser usado como tipo de campo y como argumento de entrada.
 */
registerEnumType(TaskStatus, {
  name: 'TaskStatus',
  description: 'Estados posibles del ciclo de vida de una tarea.',
});
