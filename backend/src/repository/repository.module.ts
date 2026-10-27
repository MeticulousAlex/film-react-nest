import 'dotenv/config';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmsRepository } from './films.repository';
import { Film as MongoFilm, FilmSchema } from './mongo/film.schema';
import { MongoFilmsRepository } from './mongo/mongo.films.repository';
import { Film } from './postgres/film.entity';
import { Schedule } from './postgres/schedule.entity';
import { PostgresFilmsRepository } from './postgres/postgres.films.repository';

@Module({})
export class RepositoryModule {
  static forRoot(): DynamicModule {
    const drivers = { mongodb, postgres };
    const driver = drivers[process.env.DATABASE_DRIVER];
    if (!driver) {
      throw new Error('DATABASE_DRIVER must be "mongodb" or "postgres"');
    }
    return driver;
  }
}

const mongodb: DynamicModule = {
  module: RepositoryModule,
  global: true,
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('DATABASE_URL'),
      }),
    }),
    MongooseModule.forFeature([{ name: MongoFilm.name, schema: FilmSchema }]),
  ],
  providers: [{ provide: FilmsRepository, useClass: MongoFilmsRepository }],
  exports: [FilmsRepository],
};

const postgres: DynamicModule = {
  module: RepositoryModule,
  global: true,
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        username: config.get<string>('DATABASE_USERNAME'),
        password: config.get<string>('DATABASE_PASSWORD'),
        entities: [Film, Schedule],
      }),
    }),
    TypeOrmModule.forFeature([Film, Schedule]),
  ],
  providers: [{ provide: FilmsRepository, useClass: PostgresFilmsRepository }],
  exports: [FilmsRepository],
};
