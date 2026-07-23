import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Interceptor transversal (AOP) que mide el tiempo de ejecucion de cada
 * operacion GraphQL (Query o Mutation) y lo registra junto con su nombre.
 * Se apoya en `GqlExecutionContext` para traducir el `ExecutionContext`
 * generico de Nest al contexto especifico de GraphQL y asi acceder al
 * `info.fieldName` de la operacion en curso.
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('GraphQL');

  /**
   * Envuelve la ejecucion del resolver: toma tiempo antes de invocar al
   * siguiente handler y, al recibir la respuesta (via `tap`), calcula y
   * registra la duracion total de la operacion.
   * @param context Contexto de ejecucion de Nest para la peticion actual.
   * @param next Handler que continua la cadena de ejecucion del resolver.
   * @returns El `Observable` de la respuesta, sin modificar su contenido.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const gqlContext = GqlExecutionContext.create(context);
    const operationName = gqlContext.getInfo()?.fieldName ?? 'unknown';
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const elapsedMs = Date.now() - startTime;
        this.logger.log(`${operationName} ejecutado en ${elapsedMs}ms`);
      }),
    );
  }
}
