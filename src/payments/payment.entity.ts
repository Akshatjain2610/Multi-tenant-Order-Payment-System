import { Entity, Column, ManyToOne, Index, JoinColumn } from 'typeorm';
import { BaseEntity } from '../common/base/base.entity';
import { Order } from '../orders/order.entity';

@Entity('payments')
@Index(['tenantId', 'idempotencyKey'], { unique: true })
export class Payment extends BaseEntity {
  @Column()
  orderId: number;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  status: 'PENDING' | 'SUCCESS' | 'FAILED';

  @Column()
  idempotencyKey: string;
}
