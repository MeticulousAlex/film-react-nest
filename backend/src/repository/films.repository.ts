import { FilmDto, ScheduleDto } from '../films/dto/films.dto';

export abstract class FilmsRepository {
  abstract findAll(): Promise<FilmDto[]>;

  abstract findSchedule(id: string): Promise<ScheduleDto[] | null>;

  abstract takeSeats(
    filmId: string,
    sessionId: string,
    seats: string[],
  ): Promise<boolean>;

  abstract releaseSeats(
    filmId: string,
    sessionId: string,
    seats: string[],
  ): Promise<void>;
}
