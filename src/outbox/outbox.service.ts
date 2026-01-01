import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OutboxEvent } from './outbox.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class OutboxService {
  constructor(
    @InjectRepository(OutboxEvent)
    private repo: Repository<OutboxEvent>,
  ) {}

  async add(
    manager: EntityManager,
    data: {
      aggregate: string;
      type: string;
      payload: any;
    },
  ) {
    const event = manager.create(OutboxEvent, {
      ...data,
      createdAt: new Date(),
    });

    await manager.save(event);
  }
}