import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

@Module({
  imports: [
    // Configuración de GraphQL (Enfoque Code-First)
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      // Generará el esquema automáticamente en esta ruta
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    // Configuración de la Base de Datos SQLite
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      autoLoadEntities: true, // Carga las entidades automáticamente sin declararlas una por una
      synchronize: true, // Sincroniza la DB con tus entidades (ideal para desarrollo local)
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
