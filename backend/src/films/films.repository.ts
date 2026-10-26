import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilmDto, ScheduleDto } from './dto/films.dto';
import { Film } from './schemas/film.schema';

@Injectable()
export class FilmsRepository {
  constructor(@InjectModel(Film.name) private readonly film: Model<Film>) {}

  findAll(): Promise<FilmDto[]> {
    return this.film.find({}, { _id: 0, schedule: 0 }).lean().exec();
  }

  async findSchedule(id: string): Promise<ScheduleDto[] | null> {
    const film = await this.film
      .findOne({ id }, { _id: 0, schedule: 1 })
      .lean()
      .exec();
    return film?.schedule ?? null;
  }

  async takeSeats(
    filmId: string,
    sessionId: string,
    seats: string[],
  ): Promise<boolean> {
    const res = await this.film.updateOne(
      {
        id: filmId,
        schedule: { $elemMatch: { id: sessionId, taken: { $nin: seats } } },
      },
      { $push: { 'schedule.$.taken': { $each: seats } } },
    );
    return res.modifiedCount === 1;
  }

  async releaseSeats(
    filmId: string,
    sessionId: string,
    seats: string[],
  ): Promise<void> {
    await this.film.updateOne(
      { id: filmId, 'schedule.id': sessionId },
      { $pull: { 'schedule.$.taken': { $in: seats } } },
    );
  }
}
