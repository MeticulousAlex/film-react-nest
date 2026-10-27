import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ScheduleDto } from '../../films/dto/films.dto';
import { Film } from './film.entity';

@Entity('schedules')
export class Schedule implements ScheduleDto {
  @PrimaryColumn('uuid') id: string;
  @Column() daytime: string;
  @Column() hall: string;
  @Column('int') rows: number;
  @Column('int') seats: number;
  @Column('int') price: number;
  @Column('text', { array: true, default: '{}' }) taken: string[];

  @Column('uuid') filmId: string;
  @ManyToOne(() => Film, (film) => film.schedule, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'filmId' })
  film: Film;
}
