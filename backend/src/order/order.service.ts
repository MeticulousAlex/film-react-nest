import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { FilmsRepository } from '../repository/films.repository';
import { ListDto } from '../films/dto/films.dto';
import { CreateOrderDto, OrderedTicketDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly repository: FilmsRepository) {}

  async create({
    tickets,
  }: CreateOrderDto): Promise<ListDto<OrderedTicketDto>> {
    const keys = tickets.map((t) => `${t.row}:${t.seat}`);

    if (
      new Set(tickets.map((t) => `${t.session}/${t.row}:${t.seat}`)).size !==
      tickets.length
    ) {
      throw new BadRequestException('В заказе дублируются места');
    }

    const done: number[] = [];
    for (const [i, t] of tickets.entries()) {
      if (await this.repository.takeSeats(t.film, t.session, [keys[i]])) {
        done.push(i);
        continue;
      }
      await Promise.all(
        done.map((j) =>
          this.repository.releaseSeats(tickets[j].film, tickets[j].session, [
            keys[j],
          ]),
        ),
      );
      throw new BadRequestException(
        `Место ${keys[i]} занято или сеанс не найден`,
      );
    }
    const items = tickets.map((t) => ({ ...t, id: randomUUID() }));
    return { total: items.length, items };
  }
}
