import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { FilmDto } from '../../films/dto/films.dto';
import { Schedule } from './schedule.entity';

@Entity('films')
export class Film implements FilmDto {
  @PrimaryColumn('uuid') id: string;
  @Column('double precision') rating: number;
  @Column() director: string;
  @Column('text', { array: true }) tags: string[];
  @Column() title: string;
  @Column() about: string;
  @Column() description: string;
  @Column() image: string;
  @Column() cover: string;

  @OneToMany(() => Schedule, (schedule) => schedule.film)
  schedule: Schedule[];
}
