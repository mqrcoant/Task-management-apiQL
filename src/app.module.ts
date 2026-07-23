import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    // Configuración de GraphQL (Enfoque Code-First)
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // Generará el esquema automáticamente en esta ruta
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      // Evita que Apollo filtre el stack trace en las extensions del error,
      // incluso fuera de NODE_ENV=production; el detalle tecnico ya queda
      // registrado por GraphQLExceptionFilter via Logger.
      includeStacktraceInErrorResponses: false,
    }),
    // Configuración de la Base de Datos SQLite
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'database.sqlite',
      autoLoadEntities: true, // Carga las entidades automáticamente sin declararlas una por una
      synchronize: true, // Sincroniza la DB con tus entidades (ideal para desarrollo local)
    }),
    TasksModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
