import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { QueryFailedError } from 'typeorm';

/**
 * Filtro transversal (AOP) que centraliza el manejo de excepciones lanzadas
 * durante la resolucion de operaciones GraphQL. Registra el error tecnico
 * completo en el `Logger` del servidor y devuelve al cliente un
 * `GraphQLError` con un mensaje seguro, sin exponer detalles internos de la
 * base de datos ni *stack traces*.
 */
@Catch()
export class GraphQLExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('GraphQLExceptionFilter');

  /**
   * Intercepta cualquier excepcion no controlada del pipeline de GraphQL,
   * la registra para diagnostico interno y traduce el error a una forma
   * apta para el cliente segun su origen (validacion HTTP, TypeORM u otro).
   * @param exception Excepcion capturada, de tipo desconocido en tiempo de compilacion.
   * @param host Contexto de argumentos de Nest para la peticion actual.
   * @returns Un `GraphQLError` con mensaje, codigo y metadata seguros para el cliente.
   */
  catch(exception: unknown, host: ArgumentsHost): GraphQLError {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();
      const message =
        typeof response === 'string'
          ? response
          : ((response as { message?: string | string[] })?.message ?? exception.message);

      this.logger.error(`[HttpException] ${exception.message}`, exception.stack);

      return new GraphQLError(Array.isArray(message) ? message.join(', ') : message, {
        extensions: { code: this.mapStatusToCode(status) },
      });
    }

    if (exception instanceof QueryFailedError) {
      this.logger.error(`[QueryFailedError] ${exception.message}`, exception.stack);

      return new GraphQLError('Error al procesar la operacion en la base de datos.', {
        extensions: { code: 'DATABASE_ERROR' },
      });
    }

    const error = exception as Error;
    this.logger.error(`[UnhandledException] ${error?.message ?? exception}`, error?.stack);

    return new GraphQLError('Ha ocurrido un error interno inesperado.', {
      extensions: { code: 'INTERNAL_SERVER_ERROR' },
    });
  }

  /**
   * Traduce un codigo de estado HTTP al codigo de extension GraphQL
   * correspondiente, usado por el cliente para diferenciar tipos de error.
   * @param status Codigo de estado HTTP asociado a la excepcion original.
   * @returns Codigo de extension GraphQL equivalente.
   */
  private mapStatusToCode(status: number): string {
    switch (status) {
      case 400:
        return 'BAD_USER_INPUT';
      case 404:
        return 'NOT_FOUND';
      default:
        return 'INTERNAL_SERVER_ERROR';
    }
  }
}
