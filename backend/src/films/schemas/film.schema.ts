import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FilmDto, ScheduleDto } from '../dto/films.dto';

@Schema({ _id: false })
export class Schedule implements ScheduleDto {
  @Prop({ required: true }) id: string;
  @Prop() daytime: string;
  @Prop() hall: string;
  @Prop() rows: number;
  @Prop() seats: number;
  @Prop() price: number;
  @Prop({ type: [String], default: [] }) taken: string[];
}
const ScheduleSchema = SchemaFactory.createForClass(Schedule);

@Schema()
export class Film implements FilmDto {
  @Prop({ required: true, unique: true }) id: string;
  @Prop() rating: number;
  @Prop() director: string;
  @Prop([String]) tags: string[];
  @Prop() title: string;
  @Prop() about: string;
  @Prop() description: string;
  @Prop() image: string;
  @Prop() cover: string;
  @Prop({ type: [ScheduleSchema], default: [] }) schedule: Schedule[];
}
export const FilmSchema = SchemaFactory.createForClass(Film);
