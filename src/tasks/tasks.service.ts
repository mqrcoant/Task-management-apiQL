import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { Task } from './entities/task.entity';

/**
 * Logica de negocio del modulo de tareas.
 * Centraliza todas las operaciones CRUD sobre la entidad `Task` y es la unica
 * capa autorizada a hablar con el repositorio de TypeORM.
 */
@Injectable()
export class TasksService {
  /**
   * @param taskRepository Repositorio de TypeORM asociado a la entidad `Task`.
   */
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  /**
   * Recupera todas las tareas registradas, de la mas reciente a la mas antigua.
   * @returns Listado completo de tareas.
   */
  async findAll(): Promise<Task[]> {
    return this.taskRepository.find({ order: { createdAt: 'DESC' } });
  }

  /**
   * Busca una tarea por su identificador.
   * @param id Identificador (UUID) de la tarea.
   * @returns La tarea encontrada.
   * @throws {NotFoundException} Si no existe una tarea con ese `id`.
   */
  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException(`La tarea con id "${id}" no existe.`);
    }

    return task;
  }

  /**
   * Crea y persiste una nueva tarea con estado inicial `BACKLOG`.
   * Si no se reciben etiquetas, la tarea se crea con un arreglo vacio en
   * lugar de dejar el campo sin definir.
   * @param input Datos de la tarea a crear.
   * @returns La tarea creada, ya con `id` y fechas asignadas.
   */
  async create(input: CreateTaskInput): Promise<Task> {
    const task = this.taskRepository.create({
      ...input,
      tags: input.tags ?? [],
    });

    return this.taskRepository.save(task);
  }

  /**
   * Actualiza los campos recibidos de una tarea existente.
   * El `id` presente en el input se descarta a favor del parametro `id`, de
   * modo que nunca se reasigna la clave primaria. Los campos declarados en el
   * input pero no enviados por el cliente llegan como `undefined`, por lo que
   * se filtran antes de mezclarlos: de lo contrario sobrescribirian con `null`
   * valores que el cliente nunca quiso tocar.
   * @param id Identificador (UUID) de la tarea a actualizar.
   * @param input Campos a modificar; los omitidos conservan su valor actual.
   * @returns La tarea ya actualizada.
   * @throws {NotFoundException} Si no existe una tarea con ese `id`.
   */
  async update(id: string, input: UpdateTaskInput): Promise<Task> {
    const { id: _ignoredId, ...changes } = input;
    const task = await this.findOne(id);

    for (const [field, value] of Object.entries(changes)) {
      if (value !== undefined) {
        task[field] = value;
      }
    }

    return this.taskRepository.save(task);
  }

  /**
   * Elimina una tarea existente.
   * @param id Identificador (UUID) de la tarea a eliminar.
   * @returns `true` cuando la eliminacion se completo correctamente.
   * @throws {NotFoundException} Si no existe una tarea con ese `id`.
   */
  async remove(id: string): Promise<boolean> {
    const task = await this.findOne(id);

    await this.taskRepository.remove(task);

    return true;
  }
}
