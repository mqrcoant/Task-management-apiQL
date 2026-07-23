import { UseFilters, UseInterceptors } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLExceptionFilter } from '../common/filters/graphql-exception.filter';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { Task } from './entities/task.entity';
import { TasksService } from './tasks.service';

/**
 * Resolver GraphQL del dominio de tareas.
 * Expone las queries y mutations del tipo `Task`, delegando toda la logica
 * de negocio en `TasksService`. Aplica de forma transversal (AOP) el
 * interceptor de logging/medicion de tiempo y el filtro de excepciones
 * a todas las operaciones de la clase.
 */
@Resolver(() => Task)
@UseInterceptors(LoggingInterceptor)
@UseFilters(GraphQLExceptionFilter)
export class TasksResolver {
  /**
   * @param tasksService Servicio con la logica de negocio del modulo de tareas.
   */
  constructor(private readonly tasksService: TasksService) {}

  /**
   * Query `tasks`: recupera el listado completo de tareas.
   * @returns Todas las tareas registradas, de la mas reciente a la mas antigua.
   */
  @Query(() => [Task], { name: 'tasks' })
  findAll(): Promise<Task[]> {
    return this.tasksService.findAll();
  }

  /**
   * Query `task`: recupera una tarea puntual por su identificador.
   * @param id Identificador (UUID) de la tarea solicitada.
   * @returns La tarea encontrada.
   * @throws {NotFoundException} Si no existe una tarea con ese `id`.
   */
  @Query(() => Task, { name: 'task' })
  findOne(@Args('id', { type: () => ID }) id: string): Promise<Task> {
    return this.tasksService.findOne(id);
  }

  /**
   * Mutation `createTask`: crea una nueva tarea con estado inicial `PENDING`.
   * @param input Datos de la tarea a crear.
   * @returns La tarea creada, ya con `id` y fechas asignadas.
   */
  @Mutation(() => Task)
  createTask(@Args('input') input: CreateTaskInput): Promise<Task> {
    return this.tasksService.create(input);
  }

  /**
   * Mutation `updateTask`: actualiza los campos recibidos de una tarea existente.
   * El `id` se toma del propio `input`; el servicio ignora cualquier `id`
   * duplicado y nunca reasigna la clave primaria.
   * @param input Campos a modificar, incluyendo el `id` de la tarea objetivo.
   * @returns La tarea ya actualizada.
   * @throws {NotFoundException} Si no existe una tarea con ese `id`.
   */
  @Mutation(() => Task)
  updateTask(@Args('input') input: UpdateTaskInput): Promise<Task> {
    return this.tasksService.update(input.id, input);
  }

  /**
   * Mutation `removeTask`: elimina una tarea existente.
   * @param id Identificador (UUID) de la tarea a eliminar.
   * @returns `true` cuando la eliminacion se completo correctamente.
   * @throws {NotFoundException} Si no existe una tarea con ese `id`.
   */
  @Mutation(() => Boolean)
  removeTask(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    return this.tasksService.remove(id);
  }
}
