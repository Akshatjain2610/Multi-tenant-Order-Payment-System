import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../common/base/base.entity';
import { User } from '../users/user.entity';

@Entity('orders')
export class Order extends BaseEntity {
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  status: string;

  @ManyToOne(() => User)
  user: User;
}
