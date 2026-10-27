import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilmDto, ScheduleDto } from '../../films/dto/films.dto';
import { FilmsRepository } from '../films.repository';
import { Film } from './film.entity';
import { Schedule } from './schedule.entity';

@Injectable()
export class PostgresFilmsRepository implements FilmsRepository {
  constructor(
    @InjectRepository(Film) private readonly films: Repository<Film>,
    @InjectRepository(Schedule)
    private readonly schedules: Repository<Schedule>,
  ) {}

  findAll(): Promise<FilmDto[]> {
    return this.films.find();
  }

  async findSchedule(id: string): Promise<ScheduleDto[] | null> {
    if (!(await this.films.existsBy({ id }))) return null;
    return this.schedules.find({
      where: { filmId: id },
      select: ['id', 'daytime', 'hall', 'rows', 'seats', 'price', 'taken'],
      order: { daytime: 'ASC' },
    });
  }

  async takeSeats(
    filmId: string,
    sessionId: string,
    seats: string[],
  ): Promise<boolean> {
    const res = await this.schedules
      .createQueryBuilder()
      .update()
      .set({ taken: () => 'taken || ARRAY[:...seats]::text[]' })
      .where('id = :sessionId AND "filmId" = :filmId', { sessionId, filmId })
      .andWhere('NOT (taken && ARRAY[:...seats]::text[])', { seats })
      .execute();
    return res.affected === 1;
  }

  async releaseSeats(
    filmId: string,
    sessionId: string,
    seats: string[],
  ): Promise<void> {
    await this.schedules
      .createQueryBuilder()
      .update()
      .set({
        taken: () =>
          'ARRAY(SELECT t FROM unnest(taken) t WHERE t <> ALL(ARRAY[:...seats]::text[]))',
      })
      .where('id = :sessionId AND "filmId" = :filmId', { sessionId, filmId })
      .setParameter('seats', seats)
      .execute();
  }
}
