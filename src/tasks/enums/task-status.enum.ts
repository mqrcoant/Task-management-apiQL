import { registerEnumType } from '@nestjs/graphql';

/**
 * Estados posibles del ciclo de vida de una tarea, siguiendo el flujo de
 * trabajo habitual de un tablero de desarrollo de software.
 * Se utiliza tanto en la capa de persistencia (columna `status` de la entidad
 * `Task`) como en la capa de exposicion GraphQL, donde queda registrado como
 * un `enum` del esquema.
 */
export enum TaskStatus {
  /** La tarea esta registrada pero aun no fue priorizada para su ejecucion. */
  BACKLOG = 'BACKLOG',
  /** La tarea ya fue priorizada y esta lista para comenzar. */
  TODO = 'TODO',
  /** La tarea esta actualmente en ejecucion. */
  IN_PROGRESS = 'IN_PROGRESS',
  /** La tarea fue finalizada. */
  DONE = 'DONE',
}

/**
 * Registra `TaskStatus` en el esquema GraphQL (enfoque Code-First) para que
 * pueda ser usado como tipo de campo y como argumento de entrada.
 */
registerEnumType(TaskStatus, {
  name: 'TaskStatus',
  description: 'Estados posibles del ciclo de vida de una tarea.',
  valuesMap: {
    BACKLOG: { description: 'Registrada, aun sin priorizar.' },
    TODO: { description: 'Priorizada y lista para comenzar.' },
    IN_PROGRESS: { description: 'En ejecucion.' },
    DONE: { description: 'Finalizada.' },
  },
});
