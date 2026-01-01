// src/outbox/outbox.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('outbox_events')
@Index(['status'])
export class OutboxEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  aggregate: string; // 'payment'

  @Column()
  type: string; // 'PAYMENT_SUCCESS'

  @Column('json')
  payload: any;

  @Column({ default: 'PENDING' })
  status: 'PENDING' | 'PROCESSED';

  @Column()
  createdAt: Date;
}
